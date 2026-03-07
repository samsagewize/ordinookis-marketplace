import type { Listing } from '@/types'

const ENDPOINT = '/api/test-listings'

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < retries) await new Promise((r) => setTimeout(r, 300 * (i + 1)))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Request failed')
}

export async function fetchSharedListings(): Promise<Listing[]> {
  return withRetry(async () => {
    const res = await fetch(ENDPOINT, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load shared listings')
    const data = await res.json()
    return data.listings ?? []
  })
}

export async function upsertSharedListing(listing: Listing): Promise<void> {
  return withRetry(async () => {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert', listing }),
    })
    if (!res.ok) throw new Error('Failed to save listing')
  })
}

export async function cancelSharedListing(listingId: string): Promise<void> {
  return withRetry(async () => {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', listingId }),
    })
    if (!res.ok) throw new Error('Failed to cancel listing')
  })
}

export async function markSharedSold(listingId: string, buyerAddress: string, txid: string): Promise<void> {
  return withRetry(async () => {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markSold', listingId, buyerAddress, txid }),
    })
    if (!res.ok) throw new Error('Failed to mark listing sold')
  })
}
