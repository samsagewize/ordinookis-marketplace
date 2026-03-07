/**
 * Local listings store — persists to localStorage for testing without a DB.
 * In production, replace with Supabase calls.
 */

import type { Listing, Offer, TradeActivity } from '@/types'

const LISTINGS_KEY = 'nooki_listings'
const OFFERS_KEY = 'nooki_offers'
const ACTIVITY_KEY = 'nooki_activity'

// ─── Listings ─────────────────────────────────────────────────────────────────

export function getListings(): Listing[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) ?? '[]')
  } catch { return [] }
}

export function saveListing(listing: Listing): void {
  const listings = getListings()
  const idx = listings.findIndex((l) => l.id === listing.id)
  if (idx >= 0) listings[idx] = listing
  else listings.unshift(listing)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

export function getListingByInscription(inscriptionId: string): Listing | null {
  return getListings().find(
    (l) => l.inscriptionId === inscriptionId && l.status === 'active'
  ) ?? null
}

export function cancelListing(listingId: string): void {
  const listings = getListings().map((l) =>
    l.id === listingId ? { ...l, status: 'cancelled' as const } : l
  )
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

export function markSold(
  listingId: string,
  buyerAddress: string,
  txid: string
): void {
  const listings = getListings().map((l) =>
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
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

// ─── Offers ───────────────────────────────────────────────────────────────────

export function getOffers(inscriptionId?: string): Offer[] {
  if (typeof window === 'undefined') return []
  try {
    const all: Offer[] = JSON.parse(localStorage.getItem(OFFERS_KEY) ?? '[]')
    return inscriptionId ? all.filter((o) => o.inscriptionId === inscriptionId) : all
  } catch { return [] }
}

export function saveOffer(offer: Offer): void {
  const offers = getOffers()
  offers.unshift(offer)
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function getActivity(): TradeActivity[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? '[]')
  } catch { return [] }
}

export function addActivity(activity: TradeActivity): void {
  const all = getActivity()
  all.unshift(activity)
  // Keep last 200 events
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(all.slice(0, 200)))
}

// ─── ID generator ─────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
