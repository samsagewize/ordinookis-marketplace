import type { Ordinooki, RarityData, TraitRarity } from '@/types'

// ─── Load & Enrich Collection ─────────────────────────────────────────────────

export function enrichCollection(raw: Ordinooki[]): Ordinooki[] {
  const rarity = computeRarity(raw)
  return raw.map((item) => ({
    ...item,
    number: parseInt(item.meta.name.replace('Ordinooki#', ''), 10),
    rarityScore: rarity[item.id]?.score ?? 0,
    rarityRank: rarity[item.id]?.rank ?? raw.length,
  }))
}

// ─── Rarity Computation ───────────────────────────────────────────────────────

export function computeRarity(collection: Ordinooki[]): RarityData {
  const total = collection.length

  // Count each trait value occurrence
  const traitCounts: Record<string, Record<string, number>> = {}
  for (const item of collection) {
    for (const attr of item.meta.attributes) {
      if (!traitCounts[attr.trait_type]) traitCounts[attr.trait_type] = {}
      traitCounts[attr.trait_type][attr.value] =
        (traitCounts[attr.trait_type][attr.value] ?? 0) + 1
    }
  }

  // Compute per-item rarity scores (sum of 1/probability for each trait)
  const scores: Array<{ id: string; score: number; traitRarities: TraitRarity[] }> = []

  for (const item of collection) {
    let score = 0
    const traitRarities: TraitRarity[] = []

    for (const attr of item.meta.attributes) {
      const count = traitCounts[attr.trait_type]?.[attr.value] ?? 1
      const pct = count / total
      const rarityScore = 1 / pct

      score += rarityScore
      traitRarities.push({
        trait_type: attr.trait_type,
        value: attr.value,
        count,
        percentage: Math.round(pct * 1000) / 10,
        rarityScore: Math.round(rarityScore),
      })
    }

    scores.push({ id: item.id, score: Math.round(score), traitRarities })
  }

  // Rank by score (higher = rarer)
  scores.sort((a, b) => b.score - a.score)

  const result: RarityData = {}
  scores.forEach((s, i) => {
    result[s.id] = { score: s.score, rank: i + 1, traitRarities: s.traitRarities }
  })

  return result
}

// ─── Trait Helpers ─────────────────────────────────────────────────────────────

export function getTrait(item: Ordinooki, traitType: string): string {
  return (
    item.meta.attributes.find((a) => a.trait_type === traitType)?.value ?? 'none'
  )
}

export function getAllTraitValues(
  collection: Ordinooki[],
  traitType: string
): string[] {
  const vals = new Set<string>()
  for (const item of collection) {
    const v = getTrait(item, traitType)
    if (v && v !== 'none') vals.add(v)
  }
  return Array.from(vals).sort()
}

// ─── BTC / Sats Formatting ────────────────────────────────────────────────────

export function satsToDisplay(sats: number): string {
  const btc = sats / 1e8
  if (btc < 0.001) return `${sats.toLocaleString()} sats`
  return `${btc.toFixed(5)} BTC`
}

export function btcToSats(btc: number): number {
  return Math.round(btc * 1e8)
}

// ─── Address Truncation ───────────────────────────────────────────────────────

export function truncateAddress(addr: string, chars = 8): string {
  if (!addr) return ''
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`
}

export function truncateId(id: string): string {
  return `${id.slice(0, 10)}...${id.slice(-4)}`
}

// ─── Ordinal Image URL ────────────────────────────────────────────────────────
// Fetches inscription image from Hiro / ordinals.com

export function getInscriptionImageUrl(inscriptionId: string): string {
  // Strip the trailing "i0" for the base ID
  const baseId = inscriptionId.replace(/i\d+$/, '')
  return `https://ord.io/${inscriptionId}`
}

export function getHiroImageUrl(inscriptionId: string): string {
  return `https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}/content`
}
