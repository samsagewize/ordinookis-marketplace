import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import type { Listing } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'test-listings.json')
let writeQueue: Promise<void> = Promise.resolve()

async function readListings(): Promise<Listing[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeListings(listings: Listing[]): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    const tmp = `${DATA_FILE}.tmp`
    await fs.writeFile(tmp, JSON.stringify(listings, null, 2), 'utf8')
    await fs.rename(tmp, DATA_FILE)
  })
  return writeQueue
}

export async function GET() {
  const listings = await readListings()
  return NextResponse.json({ listings })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const listings = await readListings()

    if (body.action === 'upsert' && body.listing) {
      const listing: Listing = body.listing
      const idx = listings.findIndex((l) => l.id === listing.id)
      if (idx >= 0) listings[idx] = listing
      else listings.unshift(listing)
      await writeListings(listings)
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'cancel' && body.listingId) {
      const next = listings.map((l) =>
        l.id === body.listingId ? { ...l, status: 'cancelled' as const } : l
      )
      await writeListings(next)
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'markSold' && body.listingId) {
      const next = listings.map((l) =>
        l.id === body.listingId
          ? {
              ...l,
              status: 'sold' as const,
              soldAt: new Date().toISOString(),
              buyerAddress: body.buyerAddress,
              txid: body.txid,
            }
          : l
      )
      await writeListings(next)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error', detail: String(error) }, { status: 500 })
  }
}
