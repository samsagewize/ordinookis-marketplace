import { NextRequest, NextResponse } from 'next/server'
import type { Listing } from '@/types'
import { upsertListing } from '@/lib/server/listingsStore'

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

function looksLikeBase64(s: string): boolean {
  if (!s || s.length < 40) return false
  return /^[A-Za-z0-9+/=]+$/.test(s)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const listing: Listing = body.listing

    if (!listing?.id || !listing?.inscriptionId || !listing?.sellerAddress || !listing?.sellerPaymentAddress || !listing?.priceInSats) {
      return NextResponse.json({ error: 'Missing required listing fields' }, { status: 400 })
    }

    if (!listing.signedPsbt || !looksLikeBase64(listing.signedPsbt)) {
      return NextResponse.json({ error: 'signedPsbt is required for live listings' }, { status: 400 })
    }

    const inscriptionUtxo = await fetchInscriptionUtxo(listing.inscriptionId)
    if (!inscriptionUtxo) {
      return NextResponse.json({ error: 'Inscription UTXO not found on-chain' }, { status: 409 })
    }

    await upsertListing({
      ...listing,
      status: 'active',
      createdAt: listing.createdAt || new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create listing', detail: String(err) }, { status: 500 })
  }
}
