'use client'

import { useState, useEffect } from 'react'
import type { Ordinooki, Listing } from '@/types'
import type { UseWalletReturn } from '@/hooks/useXverseWallet'
import { getTrait, satsToDisplay, truncateAddress, truncateId, btcToSats } from '@/lib/collection'
import { addActivity, saveOffer, generateId, getOffers } from '@/lib/store'
import { upsertSharedListing, cancelSharedListing } from '@/lib/sharedListings'
import { fetchFeeRate, fetchInscriptionUtxo, fetchUTXOs, estimateTxFee, feeRateToEta } from '@/lib/psbt'

interface Props {
  nooki: Ordinooki
  listing: Listing | null
  wallet: UseWalletReturn
  isOwned: boolean
  onClose: () => void
  onListingChange: () => void
  onConnectWallet: () => void
}

const BG_GRADIENTS: Record<string, string> = {
  Gray: 'linear-gradient(135deg,#3d3d55,#1a1a2e)',
  Blue: 'linear-gradient(135deg,#1a3a8f,#0d1f52)',
  Scarlet: 'linear-gradient(135deg,#8f1a2a,#4a0d14)',
  Peach: 'linear-gradient(135deg,#c47a3a,#7a4a1a)',
  Mint: 'linear-gradient(135deg,#1a7a5a,#0d4a34)',
  'BTC Orange': 'linear-gradient(135deg,#c47a1a,#7a4a0d)',
  'Pastel Pink': 'linear-gradient(135deg,#c45a7a,#7a2a4a)',
  Altered: 'linear-gradient(135deg,#5a1a9f,#2a0d5a)',
  Lilac: 'linear-gradient(135deg,#7a5ac4,#3a2a7a)',
}

function getImageUrls(id: string) {
  return [
    `https://api.hiro.so/ordinals/v1/inscriptions/${id}/content`,
    `https://ordinals.com/content/${id}`,
  ]
}

// ── Ordiscan iframe panel ─────────────────────────────────────────────────────
function OrdiscanFrame({ inscriptionId }: { inscriptionId: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(245,200,66,0.25)',
      background: '#0a0a12',
      position: 'relative',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px',
        background: 'rgba(42,26,74,0.95)',
        borderBottom: '1px solid rgba(245,200,66,0.15)',
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.9 }} />
          ))}
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1, background: 'rgba(26,14,46,0.8)',
          border: '1px solid rgba(245,200,66,0.15)',
          borderRadius: 6, padding: '3px 10px',
          fontSize: 10, color: 'rgba(184,160,208,0.8)',
          fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          🔒 ordiscan.com/inscription/{inscriptionId.slice(0,16)}…
        </div>
        <a
          href={`https://ordiscan.com/inscription/${inscriptionId}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, color: '#f5c842', fontFamily: 'monospace', textDecoration: 'none', flexShrink: 0 }}
        >
          ↗ open
        </a>
      </div>
      {/* iFrame */}
      {!loaded && (
        <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 32, animation: 'float 2s ease-in-out infinite' }}>🔍</div>
          <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11 }}>Loading Ordiscan…</p>
        </div>
      )}
      <iframe
        src={`https://ordiscan.com/inscription/${inscriptionId}`}
        title="Ordiscan"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: 300, border: 'none',
          display: loaded ? 'block' : 'none',
        }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NookiModal({
  nooki, listing, wallet, isOwned, onClose, onListingChange, onConnectWallet,
}: Props) {
  type TxStatus = 'idle' | 'fetching_utxo' | 'signing' | 'broadcasting' | 'done' | 'error'
  const LIVE_TRADES_ENABLED = process.env.NEXT_PUBLIC_ENABLE_LIVE_TRADES === 'true'
  type Mode = 'view' | 'list' | 'offer' | 'buy_confirm'

  const [mode, setMode] = useState<Mode>('view')
  const [priceInput, setPriceInput] = useState('')
  const [feeRate, setFeeRate] = useState(20)
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txError, setTxError] = useState('')
  const [txid, setTxid] = useState('')
  const [offers, setOffers] = useState(getOffers(nooki.id))
  const [imgSrc, setImgSrc] = useState(getImageUrls(nooki.id)[0])
  const [imgIdx, setImgIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [showOrdiscan, setShowOrdiscan] = useState(false)

  const bg = getTrait(nooki, 'Background')
  const gradient = BG_GRADIENTS[bg] ?? 'linear-gradient(135deg,#3a1a5a,#1a0e2e)'

  useEffect(() => { fetchFeeRate().then(setFeeRate) }, [])

  const priceInSats = priceInput ? btcToSats(parseFloat(priceInput)) : 0
  const estimatedFee = estimateTxFee(feeRate)

  function handleImgError() {
    const urls = getImageUrls(nooki.id)
    const next = imgIdx + 1
    if (next < urls.length) { setImgIdx(next); setImgSrc(urls[next]) }
  }

  const statusLabel: Record<TxStatus, string> = {
    idle: '',
    fetching_utxo: '🔍 Fetching UTXO from blockchain…',
    signing: '✍️ Waiting for Xverse to sign…',
    broadcasting: '📡 Broadcasting to Bitcoin network…',
    done: '✅ Done!',
    error: '❌ Error',
  }

  // ── LIST ──────────────────────────────────────────────────────────────────────
  async function handleList() {
    if (!wallet.connected || !wallet.addresses) return onConnectWallet()
    if (!priceInSats || priceInSats < 546) { setTxError('Minimum price is 546 sats'); return }
    setTxStatus('fetching_utxo'); setTxError('')

    try {
      // 1. Fetch the UTXO that holds this inscription
      const utxo = await fetchInscriptionUtxo(nooki.id)
      if (!utxo) throw new Error('Could not find inscription UTXO on-chain. Is this inscription on mainnet?')

      // 2. Build a dummy PSBT base64 for Xverse to sign
      //    In a full implementation you'd use bitcoinjs-lib here.
      //    For now we store a listing record with the UTXO info so buyer can construct the PSBT.
      setTxStatus('signing')

      // Store listing — UTXO info is saved so buyer can construct full PSBT
      const newListing: Listing = {
        id: generateId(),
        inscriptionId: nooki.id,
        ordinooki: nooki,
        sellerAddress: wallet.addresses.ordinals,
        priceInSats,
        status: 'active',
        createdAt: new Date().toISOString(),
        // In production: signedPsbt = await wallet.signPsbt(psbtBase64, [...])
      }
      await upsertSharedListing(newListing)
      addActivity({
        id: generateId(), type: 'listing', inscriptionId: nooki.id,
        nookiNumber: nooki.number ?? 0, fromAddress: wallet.addresses.ordinals,
        priceInSats, timestamp: new Date().toISOString(),
      })
      setTxStatus('done')
      onListingChange()
    } catch (err) {
      setTxStatus('error')
      setTxError(err instanceof Error ? err.message : 'Listing failed')
    }
  }

  // ── CANCEL ────────────────────────────────────────────────────────────────────
  async function handleCancel() {
    if (!listing) return
    try {
      await cancelSharedListing(listing.id)
      onListingChange(); onClose()
    } catch (err) {
      setTxStatus('error')
      setTxError(err instanceof Error ? err.message : 'Cancel failed')
    }
  }

  // ── BUY (production-safe phase 1: preflight only, no fake tx) ─────────────────
  async function handleBuy() {
    if (!wallet.connected || !wallet.addresses) return onConnectWallet()
    if (!listing) return
    setTxStatus('fetching_utxo'); setTxError('')

    try {
      const inscriptionUtxo = await fetchInscriptionUtxo(nooki.id)
      if (!inscriptionUtxo) {
        throw new Error('Inscription UTXO not found on-chain. Try again shortly.')
      }

      const paymentUtxos = await fetchUTXOs(wallet.addresses.payment)
      const totalNeeded = listing.priceInSats + estimatedFee + 546
      const paymentUtxo = paymentUtxos
        .filter((u) => u.value >= totalNeeded)
        .sort((a, b) => a.value - b.value)[0]

      if (!paymentUtxo) {
        throw new Error(
          `Insufficient BTC. Need at least ${satsToDisplay(totalNeeded)} in payment address (${wallet.addresses.payment.slice(0,12)}…)`
        )
      }

      if (!LIVE_TRADES_ENABLED) {
        throw new Error('Live buy is disabled until backend PSBT endpoint is enabled (Phase 2).')
      }

      // Phase 2 will implement server-side PSBT building/signing + broadcast.
      setTxStatus('error')
      setTxError('Live trade backend not wired yet.')
    } catch (err) {
      setTxStatus('error')
      setTxError(err instanceof Error ? err.message : 'Purchase failed')
    }
  }

  // ── OFFER ─────────────────────────────────────────────────────────────────────
  async function handleOffer() {
    if (!wallet.connected || !wallet.addresses) return onConnectWallet()
    if (!priceInSats || priceInSats < 546) { setTxError('Minimum 546 sats'); return }
    saveOffer({
      id: generateId(), inscriptionId: nooki.id, ordinooki: nooki,
      buyerAddress: wallet.addresses.payment,
      offerPriceInSats: priceInSats, status: 'pending',
      createdAt: new Date().toISOString(),
    })
    setTxStatus('done'); setOffers(getOffers(nooki.id))
  }

  const traits = [
    { label: 'Background', icon: '🌅', value: getTrait(nooki, 'Background') },
    { label: 'Body Color', icon: '🎨', value: getTrait(nooki, 'Body color') },
    { label: 'Body', icon: '👘', value: getTrait(nooki, 'Body') },
    { label: 'Head', icon: '🎩', value: getTrait(nooki, 'Head') },
    { label: 'Face', icon: '😶', value: getTrait(nooki, 'Face') },
    { label: 'Eyes', icon: '👁', value: getTrait(nooki, 'Eyes') },
  ]

  const inputStyle = {
    width: '100%', background: 'rgba(42,26,74,0.8)',
    border: '1px solid rgba(245,200,66,0.25)', borderRadius: 12,
    padding: '10px 14px', fontSize: 14, color: 'var(--text)',
    fontFamily: 'monospace', outline: 'none',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(10,5,20,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(160deg,#2a1a4a 0%,#1a0e2e 100%)',
        border: '1px solid rgba(245,200,66,0.22)', borderRadius: 22,
        width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7),0 0 50px rgba(245,200,66,0.06)',
        animation: 'fade-up 0.35s cubic-bezier(.22,1,.36,1) forwards',
      }}>

        {/* ── Image header ── */}
        <div style={{ position: 'relative', height: 220, background: gradient, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#f5c842,#ff8fa8,#f5c842,transparent)' }} />
          {!imgLoaded && <div style={{ fontSize: 52, animation: 'float 2s ease-in-out infinite', zIndex: 1 }}>🦝</div>}
          <img
            src={imgSrc} alt={nooki.meta.name}
            onLoad={() => setImgLoaded(true)} onError={handleImgError}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s', imageRendering: 'pixelated' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(26,14,46,0.85) 0%,transparent 55%)' }} />

          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(26,14,46,0.85)', border: '1px solid rgba(245,200,66,0.2)', color: 'var(--muted)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>×</button>

          {/* Badges */}
          {nooki.rarityRank && nooki.rarityRank <= 100 && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 7, fontFamily: 'monospace' }}>★ TOP {nooki.rarityRank}</div>
          )}
          {isOwned && (
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'linear-gradient(135deg,#4ecba0,#00e5a0)', color: '#0a1a12', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 7, fontFamily: 'monospace', zIndex: 5 }}>✓ YOUR NOOKI</div>
          )}
        </div>

        <div style={{ padding: 22 }}>
          {/* Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg,#f5c842,#ff8fa8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{nooki.meta.name}</h2>
            {nooki.rarityRank && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: '#f5c842', fontWeight: 800, fontSize: 15 }}>Rank #{nooki.rarityRank}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>of 2,907</div>
              </div>
            )}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--muted)', marginBottom: 12, wordBreak: 'break-all' }}>
            {nooki.id}
          </div>

          {/* External links */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowOrdiscan(!showOrdiscan)}
              style={{ fontSize: 11, color: showOrdiscan ? '#f5c842' : 'var(--muted)', fontFamily: 'monospace', background: showOrdiscan ? 'rgba(245,200,66,0.1)' : 'transparent', border: `1px solid ${showOrdiscan ? 'rgba(245,200,66,0.4)' : 'rgba(245,200,66,0.15)'}`, borderRadius: 7, padding: '4px 10px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              🔍 {showOrdiscan ? 'Hide' : 'View'} Ordiscan
            </button>
            <a href={`https://ord.io/${nooki.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#f5c842', fontFamily: 'monospace', textDecoration: 'none', border: '1px solid rgba(245,200,66,0.15)', borderRadius: 7, padding: '4px 10px' }}>
              ord.io ↗
            </a>
            <a href={`https://ordiscan.com/inscription/${nooki.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#f5c842', fontFamily: 'monospace', textDecoration: 'none', border: '1px solid rgba(245,200,66,0.15)', borderRadius: 7, padding: '4px 10px' }}>
              Ordiscan ↗
            </a>
          </div>

          {/* Ordiscan iframe */}
          {showOrdiscan && (
            <div style={{ marginBottom: 18 }}>
              <OrdiscanFrame inscriptionId={nooki.id} />
            </div>
          )}

          {/* Traits */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 18 }}>
            {traits.map((t) => (
              <div key={t.label} style={{ background: 'rgba(42,26,74,0.6)', border: '1px solid rgba(245,200,66,0.1)', borderRadius: 10, padding: '9px 11px' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 3 }}>{t.icon} {t.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.value}</div>
              </div>
            ))}
          </div>

          {/* ── ACTIVE LISTING INFO ── */}
          {listing && (
            <div style={{ background: 'rgba(245,200,66,0.07)', border: '1px solid rgba(245,200,66,0.25)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 3 }}>Listed for</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#f5c842' }}>{satsToDisplay(listing.priceInSats)}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 2 }}>by {truncateAddress(listing.sellerAddress)}</div>
                </div>
                {!isOwned && wallet.connected && txStatus === 'idle' && (
                  <button
                    onClick={() => setMode('buy_confirm')}
                    style={{ background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 900, padding: '13px 22px', borderRadius: 13, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 0 22px rgba(245,200,66,0.35)' }}
                  >
                    ⚡ Buy Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── BUY CONFIRM STEP ── */}
          {mode === 'buy_confirm' && listing && txStatus === 'idle' && (
            <div style={{ background: 'rgba(26,14,46,0.8)', border: '1px solid rgba(245,200,66,0.3)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <h3 style={{ color: '#f5c842', fontFamily: "'Cinzel Decorative',serif", fontSize: 14, marginBottom: 12 }}>Confirm Purchase</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'You pay', val: satsToDisplay(listing.priceInSats) },
                  { label: 'Est. fee', val: satsToDisplay(estimatedFee) },
                  { label: 'Total', val: satsToDisplay(listing.priceInSats + estimatedFee) },
                  { label: 'Confirm time', val: feeRateToEta(feeRate) },
                ].map((r) => (
                  <div key={r.label} style={{ background: 'rgba(42,26,74,0.6)', borderRadius: 9, padding: '8px 12px' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 2, textTransform: 'uppercase' }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f5c842' }}>{r.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.12)', borderRadius: 9, padding: '9px 12px', marginBottom: 12 }}>
                <p style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', lineHeight: 1.7 }}>
                  Xverse will open to sign the transaction. This is a non-custodial swap — BTC leaves your payment address and the Ordinooki arrives in your ordinals address atomically.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setMode('view')} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(245,200,66,0.2)', background: 'transparent', color: 'var(--muted)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                <button onClick={handleBuy} style={{ flex: 2, padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                  ⚡ Confirm & Sign in Xverse
                </button>
              </div>
            </div>
          )}

          {/* ── TX STATUS ── */}
          {txStatus !== 'idle' && txStatus !== 'done' && txStatus !== 'error' && (
            <div style={{ background: 'rgba(42,26,74,0.7)', border: '1px solid rgba(245,200,66,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 22, animation: 'float 1.5s ease-in-out infinite', flexShrink: 0 }}>
                {txStatus === 'fetching_utxo' ? '🔍' : txStatus === 'signing' ? '✍️' : '📡'}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#f5c842', fontSize: 13 }}>{statusLabel[txStatus]}</div>
                {txStatus === 'signing' && <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 3 }}>Check your Xverse wallet extension for the signing popup</div>}
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {txStatus === 'done' && (
            <div style={{ background: 'rgba(78,203,160,0.1)', border: '1px solid rgba(78,203,160,0.35)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🌸</div>
              <div style={{ fontWeight: 800, color: '#4ecba0', fontSize: 16, marginBottom: 4 }}>
                {mode === 'list' ? 'Listing is live!' : mode === 'offer' ? 'Offer submitted!' : 'Transaction complete!'}
              </div>
              {txid && (
                <a href={`https://mempool.space/tx/${txid}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: 6, color: '#f5c842', fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>
                  View on mempool.space ↗
                </a>
              )}
              <div style={{ marginTop: 14 }}>
                <button onClick={onClose} style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {txStatus === 'error' && (
            <div style={{ background: 'rgba(150,30,30,0.2)', border: '1px solid rgba(255,100,100,0.35)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ color: '#ff8fa8', fontWeight: 700, marginBottom: 8, fontSize: 13 }}>⚠️ {txError}</div>
              <button onClick={() => { setTxStatus('idle'); setTxError('') }} style={{ color: '#f5c842', fontFamily: 'monospace', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
            </div>
          )}

          {/* Fee info */}
          <div style={{ background: 'rgba(42,26,74,0.4)', border: '1px solid rgba(245,200,66,0.07)', borderRadius: 10, padding: '9px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>Network fee: ~{satsToDisplay(estimatedFee)} @ {feeRate} sat/vb</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{feeRateToEta(feeRate)}</span>
          </div>

          {/* ── ACTION BUTTONS ── */}
          {txStatus === 'idle' && mode !== 'buy_confirm' && (
            <>
              {!wallet.connected ? (
                <button onClick={onConnectWallet} style={{ width: '100%', background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 900, padding: 14, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 0 22px rgba(245,200,66,0.3)' }}>
                  ⚡ Connect Xverse to Trade
                </button>
              ) : isOwned ? (
                // ── OWNER ACTIONS ──
                !listing ? (
                  mode === 'list' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>List price (BTC)</label>
                        <input type="number" step="0.00001" min="0.0000546" placeholder="e.g. 0.00420" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} style={inputStyle} />
                        {priceInSats > 0 && <p style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 4 }}>= {priceInSats.toLocaleString()} sats · ~{satsToDisplay(priceInSats)}</p>}
                      </div>
                      {txError && <p style={{ color: '#ff8fa8', fontSize: 11, fontFamily: 'monospace' }}>{txError}</p>}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => { setMode('view'); setTxError('') }} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(245,200,66,0.2)', background: 'transparent', color: 'var(--muted)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleList} disabled={!priceInSats} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 900, border: 'none', cursor: 'pointer', opacity: !priceInSats ? 0.5 : 1 }}>
                          Confirm Listing ✓
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setMode('list')} style={{ width: '100%', background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 900, padding: 14, borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15 }}>
                      📜 List for Sale
                    </button>
                  )
                ) : (
                  <button onClick={handleCancel} style={{ width: '100%', border: '1px solid rgba(255,100,100,0.4)', background: 'rgba(150,30,30,0.15)', color: '#ff8fa8', fontWeight: 700, padding: '12px', borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>
                    ✕ Cancel Listing
                  </button>
                )
              ) : (
                // ── BUYER ACTIONS ──
                !listing && (
                  mode === 'offer' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>Your offer (BTC)</label>
                        <input type="number" step="0.00001" placeholder="e.g. 0.00350" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} style={inputStyle} />
                      </div>
                      {txError && <p style={{ color: '#ff8fa8', fontSize: 11, fontFamily: 'monospace' }}>{txError}</p>}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => setMode('view')} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(245,200,66,0.2)', background: 'transparent', color: 'var(--muted)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                        <button onClick={handleOffer} disabled={!priceInSats} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(245,200,66,0.4)', background: 'rgba(245,200,66,0.08)', color: '#f5c842', fontWeight: 900, cursor: 'pointer', opacity: !priceInSats ? 0.5 : 1 }}>
                          Submit Offer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setMode('offer')} style={{ width: '100%', border: '1px solid rgba(245,200,66,0.3)', background: 'rgba(245,200,66,0.06)', color: '#f5c842', fontWeight: 700, padding: '12px', borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>
                      💬 Make Offer
                    </button>
                  )
                )
              )}
            </>
          )}

          {/* Offers */}
          {offers.length > 0 && (
            <div style={{ marginTop: 18, borderTop: '1px solid rgba(245,200,66,0.1)', paddingTop: 14 }}>
              <h4 style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Offers ({offers.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {offers.slice(0, 5).map((o) => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(42,26,74,0.5)', borderRadius: 9, padding: '8px 12px', border: '1px solid rgba(245,200,66,0.07)' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--muted)' }}>{truncateAddress(o.buyerAddress)}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{satsToDisplay(o.offerPriceInSats)}</span>
                    {isOwned && <button style={{ fontSize: 11, color: '#4ecba0', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Accept</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
