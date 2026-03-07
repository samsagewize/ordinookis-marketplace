/**
 * PSBT (Partially Signed Bitcoin Transaction) utilities
 * for non-custodial Ordinals trading.
 *
 * Flow:
 *   1. Seller creates & signs a listing PSBT (SIGHASH_SINGLE | ANYONECANPAY)
 *   2. Buyer adds payment input + change output, signs, broadcasts
 *
 * For testing without a full Bitcoin node, we simulate the PSBT
 * construction and let Xverse handle the actual signing.
 */

export interface UTXO {
  txid: string
  vout: number
  value: number   // in sats
  rawTx?: string  // raw hex (needed for legacy inputs)
}

export interface ListingPsbtParams {
  inscriptionUtxo: UTXO        // The UTXO containing the Ordinal
  sellerOrdinalAddress: string  // Taproot address (receives nothing — SIGHASH_SINGLE)
  sellerPaymentAddress: string  // Where seller receives BTC
  priceInSats: number
  feeRate?: number              // sats/vbyte — defaults to fetched estimate
}

// ─── Fetch current fee rate from mempool.space ────────────────────────────────

export async function fetchFeeRate(): Promise<number> {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended')
    const data = await res.json()
    return data.fastestFee ?? 20
  } catch {
    return 20 // fallback 20 sat/vbyte
  }
}

// ─── Fetch UTXOs for an address ───────────────────────────────────────────────

export async function fetchUTXOs(address: string): Promise<UTXO[]> {
  const res = await fetch(`https://mempool.space/api/address/${address}/utxo`)
  if (!res.ok) throw new Error('Failed to fetch UTXOs')
  const data = await res.json()
  return data.map((u: { txid: string; vout: number; value: number }) => ({
    txid: u.txid,
    vout: u.vout,
    value: u.value,
  }))
}

// ─── Fetch inscription UTXO ───────────────────────────────────────────────────

export async function fetchInscriptionUtxo(inscriptionId: string): Promise<UTXO | null> {
  try {
    const res = await fetch(
      `https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}`
    )
    if (!res.ok) return null
    const data = await res.json()

    // Hiro returns location like "txid:vout:offset"
    const [txid, voutStr] = (data.location ?? '').split(':')
    const vout = parseInt(voutStr ?? '0', 10)

    // Get the sat value of this UTXO
    const utxoRes = await fetch(`https://mempool.space/api/tx/${txid}`)
    const txData = await utxoRes.json()
    const value = txData?.vout?.[vout]?.value ?? 546 // 546 = dust limit

    return { txid, vout, value }
  } catch {
    return null
  }
}

// ─── Estimate transaction size ────────────────────────────────────────────────

export function estimateTxFee(feeRate: number): number {
  // Typical Ordinals trade: 2 inputs, 2 outputs (P2TR)
  // P2TR input: 57.5 vbytes, output: 43 vbytes, overhead: 10.5
  const vbytes = 2 * 57.5 + 2 * 43 + 10.5
  return Math.ceil(vbytes * feeRate)
}

// ─── Format confirmation time ────────────────────────────────────────────────

export function feeRateToEta(feeRate: number): string {
  if (feeRate >= 50) return '~10 mins'
  if (feeRate >= 20) return '~30 mins'
  if (feeRate >= 10) return '~1 hour'
  return '~2+ hours'
}
