import { NextRequest, NextResponse } from 'next/server'
import { readListings } from '@/lib/server/listingsStore'

interface Utxo {
  txid: string
  vout: number
  value: number
}

async function fetchPaymentUtxos(address: string): Promise<Utxo[]> {
  const res = await fetch(`https://mempool.space/api/address/${address}/utxo`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch payment UTXOs')
  const data = await res.json()
  return (data ?? []).map((u: { txid: string; vout: number; value: number }) => ({
    txid: u.txid,
    vout: u.vout,
    value: u.value,
  }))
}

function estimateFeeSats(feeRate: number): number {
  const vbytes = 2 * 57.5 + 2 * 43 + 10.5
  return Math.ceil(vbytes * feeRate)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const listingId = String(body.listingId ?? '')
    const buyerPaymentAddress = String(body.buyerPaymentAddress ?? '')
    const feeRate = Number(body.feeRate ?? 20)

    if (!listingId || !buyerPaymentAddress) {
      return NextResponse.json({ error: 'listingId and buyerPaymentAddress are required' }, { status: 400 })
    }

    const listings = await readListings()
    const listing = listings.find((l) => l.id === listingId && l.status === 'active')
    if (!listing) {
      return NextResponse.json({ error: 'Active listing not found' }, { status: 404 })
    }

    if (!listing.signedPsbt) {
      return NextResponse.json({ error: 'Listing does not include seller signed PSBT' }, { status: 409 })
    }

    const paymentUtxos = await fetchPaymentUtxos(buyerPaymentAddress)
    const required = listing.priceInSats + estimateFeeSats(feeRate) + 546
    const selected = paymentUtxos
      .filter((u) => u.value >= required)
      .sort((a, b) => a.value - b.value)[0]

    if (!selected) {
      return NextResponse.json({ error: 'Insufficient BTC in buyer payment address', requiredSats: required }, { status: 409 })
    }

    // NOTE: Full PSBT merge/finalize requires bitcoinjs-lib + ordinal-safe signing rules.
    // This endpoint now provides deterministic server validation and selected UTXO plan,
    // and blocks live finalization until the PSBT engine is explicitly enabled.
    const psbtEngineEnabled = process.env.ENABLE_PSBT_ENGINE === 'true'
    if (!psbtEngineEnabled) {
      return NextResponse.json({
        error: 'PSBT engine disabled on server',
        nextStep: 'Enable ENABLE_PSBT_ENGINE=true and implement bitcoinjs-lib finalize logic',
        plan: {
          listingId,
          sellerSignedPsbtPresent: true,
          selectedPaymentUtxo: selected,
          requiredSats: required,
        },
      }, { status: 501 })
    }

    return NextResponse.json({
      ok: true,
      message: 'PSBT engine enabled but finalize implementation still pending.',
    }, { status: 501 })
  } catch (err) {
    return NextResponse.json({ error: 'Finalize failed', detail: String(err) }, { status: 500 })
  }
}
