import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const txHex = String(body.txHex ?? '')
    if (!txHex) {
      return NextResponse.json({ error: 'txHex is required' }, { status: 400 })
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
