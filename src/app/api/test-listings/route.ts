import { NextRequest, NextResponse } from 'next/server'
import type { Listing } from '@/types'
import { readListings, upsertListing, cancelListing, markListingSold } from '@/lib/server/listingsStore'

export async function GET() {
  const listings = await readListings()
  return NextResponse.json({ listings })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.action === 'upsert' && body.listing) {
      const listing: Listing = body.listing
      await upsertListing(listing)
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'cancel' && body.listingId) {
      await cancelListing(body.listingId)
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'markSold' && body.listingId) {
      await markListingSold(body.listingId, body.buyerAddress, body.txid)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error', detail: String(error) }, { status: 500 })
  }
}
