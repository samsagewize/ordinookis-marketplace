import { NextRequest, NextResponse } from 'next/server'

interface Utxo {
  txid: string
  vout: number
  value: number
}

async function fetchInscriptionUtxo(inscriptionId: string): Promise<Utxo | null> {
  try {
    const hiro = await fetch(`https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}`, { cache: 'no-store' })
    if (!hiro.ok) return null
    const data = await hiro.json()
    const [txid, voutStr] = (data.location ?? '').split(':')
    if (!txid) return null
    const vout = Number.parseInt(voutStr ?? '0', 10)

    const txRes = await fetch(`https://mempool.space/api/tx/${txid}`, { cache: 'no-store' })
    if (!txRes.ok) return null
    const tx = await txRes.json()
    const value = tx?.vout?.[vout]?.value
    if (typeof value !== 'number') return null

    return { txid, vout, value }
  } catch {
    return null
  }
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
    const inscriptionId = String(body.inscriptionId ?? '')
    const paymentAddress = String(body.paymentAddress ?? '')
    const priceInSats = Number(body.priceInSats ?? 0)
    const feeRate = Number(body.feeRate ?? 20)

    if (!inscriptionId || !paymentAddress || !priceInSats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const inscriptionUtxo = await fetchInscriptionUtxo(inscriptionId)
    if (!inscriptionUtxo) {
      return NextResponse.json({ error: 'Inscription UTXO not found on-chain' }, { status: 409 })
    }

    const paymentUtxos = await fetchPaymentUtxos(paymentAddress)
    const estFee = estimateFeeSats(feeRate)
    const totalNeeded = priceInSats + estFee + 546
    const selected = paymentUtxos
      .filter((u) => u.value >= totalNeeded)
      .sort((a, b) => a.value - b.value)[0]

    if (!selected) {
      return NextResponse.json({
        error: 'Insufficient BTC in payment address',
        requiredSats: totalNeeded,
      }, { status: 409 })
    }

    return NextResponse.json({
      ok: true,
      preflight: {
        inscriptionUtxo,
        paymentUtxo: selected,
        estimatedFee: estFee,
        totalNeeded,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Preflight failed', detail: String(err) }, { status: 500 })
  }
}
