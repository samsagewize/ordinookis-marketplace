import path from 'path'
import { promises as fs } from 'fs'
import type { Listing } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'test-listings.json')
let writeQueue: Promise<void> = Promise.resolve()

export async function readListings(): Promise<Listing[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function writeListings(listings: Listing[]): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    const tmp = `${DATA_FILE}.tmp`
    await fs.writeFile(tmp, JSON.stringify(listings, null, 2), 'utf8')
    await fs.rename(tmp, DATA_FILE)
  })
  return writeQueue
}

export async function upsertListing(listing: Listing): Promise<void> {
  const listings = await readListings()
  const idx = listings.findIndex((l) => l.id === listing.id)
  if (idx >= 0) listings[idx] = listing
  else listings.unshift(listing)
  await writeListings(listings)
}

export async function cancelListing(listingId: string): Promise<void> {
  const listings = await readListings()
  const next = listings.map((l) => (l.id === listingId ? { ...l, status: 'cancelled' as const } : l))
  await writeListings(next)
}

export async function markListingSold(listingId: string, buyerAddress: string, txid: string): Promise<void> {
  const listings = await readListings()
  const next = listings.map((l) =>
    l.id === listingId
      ? {
          ...l,
          status: 'sold' as const,
          soldAt: new Date().toISOString(),
          buyerAddress,
          txid,
        }
      : l
  )
  await writeListings(next)
}
