import { NextRequest, NextResponse } from 'next/server'
import { Psbt, networks, initEccLib } from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'

initEccLib(ecc)

function looksLikeHex(s: string): boolean {
  return /^[0-9a-fA-F]+$/.test(s)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let txHex = String(body.txHex ?? '')
    const signedPsbtBase64 = String(body.signedPsbtBase64 ?? '')

    if (!txHex && !signedPsbtBase64) {
      return NextResponse.json({ error: 'txHex or signedPsbtBase64 is required' }, { status: 400 })
    }

    if (!txHex && signedPsbtBase64) {
      const psbt = Psbt.fromBase64(signedPsbtBase64, { network: networks.bitcoin })
      try {
        psbt.finalizeAllInputs()
      } catch {
        return NextResponse.json({ error: 'PSBT not fully finalized. Seller and buyer signatures may both be required.' }, { status: 409 })
      }
      txHex = psbt.extractTransaction().toHex()
    }

    if (!looksLikeHex(txHex)) {
      return NextResponse.json({ error: 'txHex must be valid hexadecimal' }, { status: 400 })
    }

    const res = await fetch('https://mempool.space/api/tx', {
      method: 'POST',
      body: txHex,
      cache: 'no-store',
    })

    const txt = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: 'Broadcast failed', detail: txt }, { status: 502 })
    }

    return NextResponse.json({ ok: true, txid: txt })
  } catch (err) {
    return NextResponse.json({ error: 'Broadcast error', detail: String(err) }, { status: 500 })
  }
}
