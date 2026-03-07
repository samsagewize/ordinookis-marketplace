'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { WalletState, Ordinooki } from '@/types'


export interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  signPsbt: (psbtBase64: string, inputsToSign: InputToSign[]) => Promise<string>
  broadcastTx: (signedPsbtBase64: string) => Promise<string>
  refreshNookis: () => Promise<void>
}

export interface InputToSign {
  index: number
  address: string
  signingIndexes: number[]
  sigHash?: number
}

const WALLET_KEY = 'nooki_wallet'
const CACHE_KEY = 'nooki_owned_cache'
const CACHE_TTL = 3 * 60 * 1000 // 3 minutes

export function useXverseWallet(collection: Ordinooki[]): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    connected: false, addresses: null,
    ownedInscriptionIds: [], ownedNookis: [],
    isLoading: false, error: null,
  })
  const collectionRef = useRef(collection)
  collectionRef.current = collection

  // Restore session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(WALLET_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (!parsed.addresses) return
      // Check for a fresh cache first
      const cachedStr = sessionStorage.getItem(CACHE_KEY)
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr)
          if (Date.now() - cached.ts < CACHE_TTL && cached.address === parsed.addresses.ordinals) {
            const ownedIds: string[] = cached.ids
            const coll = collectionRef.current
            const ownedNookis = coll.filter((n) => ownedIds.includes(n.id))
            setState({ connected: true, addresses: parsed.addresses, ownedInscriptionIds: ownedIds, ownedNookis, isLoading: false, error: null })
            return
          }
        } catch {}
      }
      setState((prev) => ({ ...prev, connected: true, addresses: parsed.addresses, isLoading: true }))
      fetchOwnedNookis(parsed.addresses.ordinals)
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Core fetch: query MULTIPLE Hiro endpoints for best coverage ───────────────
  const fetchOwnedNookis = useCallback(async (ordinalsAddress: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const coll = collectionRef.current
      const collectionIdSet = new Set(coll.map((n) => n.id))
      const ownedIds = new Set<string>()

      // Strategy 1: Query Hiro by address (paginated)
      try {
        let offset = 0
        const limit = 60
        let fetchedAll = false

        while (!fetchedAll) {
          const url = `https://api.hiro.so/ordinals/v1/inscriptions?address=${ordinalsAddress}&limit=${limit}&offset=${offset}`
          const res = await fetch(url, {
            headers: { Accept: 'application/json' },
          })
          if (!res.ok) break
          const data = await res.json()
          const results: Array<{ id: string }> = data.results ?? []

          for (const r of results) {
            if (collectionIdSet.has(r.id)) ownedIds.add(r.id)
          }

          if (results.length < limit) fetchedAll = true
          else offset += limit

          // Safety: don't fetch more than 10 pages
          if (offset >= 600) break
        }
      } catch (e) {
        console.warn('Hiro by address failed:', e)
      }

      // Strategy 2: Also check ordiscan API (catches some edge cases)
      // Ordiscan: GET /api/v1/address/{address}/inscriptions
      try {
        const res = await fetch(`https://ordiscan.com/api/v1/address/${ordinalsAddress}/inscriptions?limit=100`, {
          headers: { Accept: 'application/json' },
        })
        if (res.ok) {
          const data = await res.json()
          const results: Array<{ inscription_id?: string; id?: string }> = data.data ?? data.results ?? data ?? []
          for (const r of results) {
            const id = r.inscription_id ?? r.id
            if (id && collectionIdSet.has(id)) ownedIds.add(id)
          }
        }
      } catch (e) {
        console.warn('Ordiscan check skipped:', e)
      }

      const ownedIdArr = Array.from(ownedIds)
      const ownedNookis = coll.filter((n) => ownedIds.has(n.id))

      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        address: ordinalsAddress,
        ids: ownedIdArr,
        ts: Date.now(),
      }))

      setState((prev) => ({
        ...prev,
        ownedInscriptionIds: ownedIdArr,
        ownedNookis,
        isLoading: false,
        error: ownedIdArr.length === 0
          ? null // not an error, just none found
          : null,
      }))
    } catch (err) {
      console.error('fetchOwnedNookis error:', err)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Could not load wallet inscriptions. Check your connection.',
      }))
    }
  }, [])

  const refreshNookis = useCallback(async () => {
    sessionStorage.removeItem(CACHE_KEY)
    const saved = localStorage.getItem(WALLET_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (parsed.addresses?.ordinals) await fetchOwnedNookis(parsed.addresses.ordinals)
    } catch {}
  }, [fetchOwnedNookis])

  // ── Connect ──────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { getAddress, AddressPurpose, BitcoinNetworkType } = await import('sats-connect')

      await new Promise<void>((resolve, reject) => {
        getAddress({
          payload: {
            purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
            message: 'Connect to Nooki Market to view and trade your Ordinookis',
            network: { type: BitcoinNetworkType.Mainnet },
          },
          onFinish: async (response) => {
            const ordinalsAddr = response.addresses.find(
              (a) => a.purpose === AddressPurpose.Ordinals
            )
            const paymentAddr = response.addresses.find(
              (a) => a.purpose === AddressPurpose.Payment
            )
            if (!ordinalsAddr || !paymentAddr) {
              reject(new Error('Wallet did not return required addresses'))
              return
            }
            const addresses = {
              ordinals: ordinalsAddr.address,
              payment: paymentAddr.address,
            }
            localStorage.setItem(WALLET_KEY, JSON.stringify({ addresses }))
            setState((prev) => ({ ...prev, connected: true, addresses }))
            await fetchOwnedNookis(addresses.ordinals)
            resolve()
          },
          onCancel: () => reject(new Error('Wallet connection cancelled')),
        })
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet'
      setState((prev) => ({ ...prev, isLoading: false, error: msg, connected: false }))
    }
  }, [fetchOwnedNookis])

  // ── Disconnect ───────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    localStorage.removeItem(WALLET_KEY)
    sessionStorage.removeItem(CACHE_KEY)
    setState({
      connected: false, addresses: null,
      ownedInscriptionIds: [], ownedNookis: [],
      isLoading: false, error: null,
    })
  }, [])

  // ── Sign PSBT via Xverse ─────────────────────────────────────────────────────
  const signPsbt = useCallback(
    async (psbtBase64: string, inputsToSign: InputToSign[]): Promise<string> => {
      const { signTransaction, BitcoinNetworkType } = await import('sats-connect')
      return new Promise((resolve, reject) => {
        signTransaction({
          payload: {
            network: { type: BitcoinNetworkType.Mainnet },
            psbtBase64,
            broadcast: false,
            inputsToSign,
            message: 'Sign to complete your Nooki Market transaction',
          },
          onFinish: (resp) => resolve(resp.psbtBase64),
          onCancel: () => reject(new Error('Transaction signing cancelled')),
        })
      })
    },
    []
  )

  // ── Broadcast via mempool.space ──────────────────────────────────────────────
  const broadcastTx = useCallback(async (signedPsbtBase64: string): Promise<string> => {
    const res = await fetch('https://mempool.space/api/tx', {
      method: 'POST',
      body: signedPsbtBase64,
    })
    if (!res.ok) throw new Error('Broadcast failed: ' + (await res.text()))
    return await res.text()
  }, [])

  return { ...state, connect, disconnect, signPsbt, broadcastTx, refreshNookis }
}
