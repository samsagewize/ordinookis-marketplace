// ─── Ordinooki Collection Types ───────────────────────────────────────────────

export interface OrdAttribute {
  value: string
  trait_type: string
}

export interface OrdMeta {
  name: string
  attributes: OrdAttribute[]
}

export interface Ordinooki {
  id: string          // inscription ID (e.g. "ad1cca93...i0")
  meta: OrdMeta
  // Computed fields added at runtime
  number?: number     // parsed from "Ordinooki#2593"
  rarityScore?: number
  rarityRank?: number
}

// ─── Marketplace Types ─────────────────────────────────────────────────────────

export type ListingStatus = 'active' | 'sold' | 'cancelled'

export interface Listing {
  id: string
  inscriptionId: string
  ordinooki: Ordinooki
  sellerAddress: string
  sellerPaymentAddress?: string
  priceInSats: number
  signedPsbt?: string   // seller-signed PSBT (base64)
  status: ListingStatus
  createdAt: string
  soldAt?: string
  buyerAddress?: string
}

export interface Offer {
  id: string
  inscriptionId: string
  ordinooki: Ordinooki
  buyerAddress: string
  offerPriceInSats: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
}

export interface TradeActivity {
  id: string
  type: 'sale' | 'listing' | 'offer' | 'transfer'
  inscriptionId: string
  nookiNumber: number
  fromAddress?: string
  toAddress?: string
  priceInSats?: number
  txid?: string
  timestamp: string
}

// ─── Wallet Types ─────────────────────────────────────────────────────────────

export interface WalletAddresses {
  ordinals: string    // Taproot — holds Ordinals
  payment: string     // Segwit — pays fees
}

export interface WalletState {
  connected: boolean
  addresses: WalletAddresses | null
  ownedInscriptionIds: string[]
  ownedNookis: Ordinooki[]
  isLoading: boolean
  error: string | null
}

// ─── Filter / Sort Types ──────────────────────────────────────────────────────

export interface Filters {
  background?: string
  bodyColor?: string
  body?: string
  head?: string
  face?: string
  eyes?: string
  listedOnly?: boolean
  ownedOnly?: boolean
}

export type SortOption = 'rarity_asc' | 'rarity_desc' | 'price_asc' | 'price_desc' | 'number_asc'

// ─── Rarity ───────────────────────────────────────────────────────────────────

export interface TraitRarity {
  trait_type: string
  value: string
  count: number
  percentage: number
  rarityScore: number
}

export interface RarityData {
  [inscriptionId: string]: {
    score: number
    rank: number
    traitRarities: TraitRarity[]
  }
}
