import { NextRequest, NextResponse } from 'next/server'
import { readListings } from '@/lib/server/listingsStore'
import { Psbt, networks, payments, initEccLib } from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'

initEccLib(ecc)

interface Utxo {
  txid: string
  vout: number
  value: number
}

interface TxVoutInfo {
  value: number
  scriptpubkey: string
}

async function fetchPaymentUtxos(address: string): Promise<Utxo[]> {
  const res = await fetch(`https://mempool.space/api/address/${address}/utxo`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch payment UTXOs')
  const data = await res.json()
  return (data ?? []).map((u: { txid: string; vout: number; value: number }) => ({ txid: u.txid, vout: u.vout, value: u.value }))
}

async function fetchInscriptionUtxo(inscriptionId: string): Promise<Utxo | null> {
  try {
    const hiro = await fetch(`https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}`, { cache: 'no-store' })
    if (!hiro.ok) return null
    const data = await hiro.json()
    const [txid, voutStr] = (data.location ?? '').split(':')
    if (!txid) return null
    const vout = Number.parseInt(voutStr ?? '0', 10)
    const voutInfo = await fetchTxVout(txid, vout)
    if (!voutInfo) return null
    return { txid, vout, value: voutInfo.value }
  } catch {
    return null
  }
}

async function fetchTxVout(txid: string, vout: number): Promise<TxVoutInfo | null> {
  try {
    const res = await fetch(`https://mempool.space/api/tx/${txid}`, { cache: 'no-store' })
    if (!res.ok) return null
    const tx = await res.json()
    const out = tx?.vout?.[vout]
    if (!out) return null
    return {
      value: Number(out.value),
      scriptpubkey: String(out.scriptpubkey),
    }
  } catch {
    return null
  }
}

function estimateFeeSats(feeRate: number): number {
  const vbytes = 2 * 58 + 3 * 43 + 11
  return Math.ceil(vbytes * feeRate)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const listingId = String(body.listingId ?? '')
    const buyerPaymentAddress = String(body.buyerPaymentAddress ?? '')
    const buyerOrdinalAddress = String(body.buyerOrdinalAddress ?? '')
    const feeRate = Number(body.feeRate ?? 20)

    if (!listingId || !buyerPaymentAddress || !buyerOrdinalAddress) {
      return NextResponse.json({ error: 'listingId, buyerPaymentAddress, buyerOrdinalAddress are required' }, { status: 400 })
    }

    const listings = await readListings()
    const listing = listings.find((l) => l.id === listingId && l.status === 'active')
    if (!listing) return NextResponse.json({ error: 'Active listing not found' }, { status: 404 })
    if (!listing.sellerPaymentAddress) return NextResponse.json({ error: 'Listing missing seller payment address' }, { status: 409 })

    const inscriptionUtxo = await fetchInscriptionUtxo(listing.inscriptionId)
    if (!inscriptionUtxo) return NextResponse.json({ error: 'Inscription UTXO not found on-chain' }, { status: 409 })

    const inscriptionVout = await fetchTxVout(inscriptionUtxo.txid, inscriptionUtxo.vout)
    if (!inscriptionVout) return NextResponse.json({ error: 'Could not fetch inscription tx output details' }, { status: 409 })

    const paymentUtxos = await fetchPaymentUtxos(buyerPaymentAddress)
    const fee = estimateFeeSats(feeRate)
    const required = listing.priceInSats + fee + 546
    const selected = paymentUtxos.filter((u) => u.value >= required).sort((a, b) => a.value - b.value)[0]
    if (!selected) return NextResponse.json({ error: 'Insufficient BTC in buyer payment address', requiredSats: required }, { status: 409 })

    const paymentVout = await fetchTxVout(selected.txid, selected.vout)
    if (!paymentVout) return NextResponse.json({ error: 'Could not fetch buyer payment tx output details' }, { status: 409 })

    const change = selected.value - listing.priceInSats - fee
    if (change < 546) {
      return NextResponse.json({ error: 'Buyer UTXO too small after fee+price (change below dust).', requiredSats: required + (546 - change) }, { status: 409 })
    }

    const psbt = new Psbt({ network: networks.bitcoin })

    // Input 0: inscription UTXO (seller)
    psbt.addInput({
      hash: inscriptionUtxo.txid,
      index: inscriptionUtxo.vout,
      witnessUtxo: {
        script: Buffer.from(inscriptionVout.scriptpubkey, 'hex'),
        value: inscriptionUtxo.value,
      },
    })

    // Input 1: buyer payment UTXO
    psbt.addInput({
      hash: selected.txid,
      index: selected.vout,
      witnessUtxo: {
        script: Buffer.from(paymentVout.scriptpubkey, 'hex'),
        value: selected.value,
      },
    })

    // Output 0: inscription to buyer ordinal address
    psbt.addOutput({ address: buyerOrdinalAddress, value: inscriptionUtxo.value })
    // Output 1: payment to seller
    psbt.addOutput({ address: listing.sellerPaymentAddress, value: listing.priceInSats })
    // Output 2: change back to buyer payment address
    psbt.addOutput({ address: buyerPaymentAddress, value: change })

    const psbtBase64 = psbt.toBase64()

    return NextResponse.json({
      ok: true,
      psbtBase64,
      inputsToSign: [
        { index: 1, address: buyerPaymentAddress, signingIndexes: [0] },
      ],
      warnings: [
        'Seller signature for inscription input (index 0) is still required before broadcast.',
      ],
    })
  } catch (err) {
    return NextResponse.json({ error: 'Finalize failed', detail: String(err) }, { status: 500 })
  }
}
