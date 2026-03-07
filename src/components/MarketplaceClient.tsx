'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Ordinooki, Filters, SortOption, Listing } from '@/types'
import { useXverseWallet } from '@/hooks/useXverseWallet'
import { getAllTraitValues, getTrait, satsToDisplay, truncateAddress } from '@/lib/collection'
import { getListings } from '@/lib/store'
import NookiCard from '@/components/NookiCard'
import NookiModal from '@/components/NookiModal'
import WalletModal from '@/components/WalletModal'
import FilterPanel from '@/components/FilterPanel'

interface Props { collection: Ordinooki[] }

function SakuraPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 11) % 100}%`,
          top: '-20px',
          fontSize: `${12 + (i % 4) * 4}px`,
          animation: `sakura-fall ${9 + i * 0.8}s ${i * 1.2}s linear infinite`,
          opacity: 0,
        }}>🌸</div>
      ))}
    </div>
  )
}

export default function MarketplaceClient({ collection }: Props) {
  const wallet = useXverseWallet(collection)
  const [filters, setFilters] = useState<Filters>({})
  const [sort, setSort] = useState<SortOption>('rarity_asc')
  const [search, setSearch] = useState('')
  const [selectedNooki, setSelectedNooki] = useState<Ordinooki | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'listed' | 'mine'>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => { setListings(getListings()) }, [])
  const refreshListings = useCallback(() => { setListings(getListings()) }, [])

  const traitOptions = useMemo(() => ({
    Background: getAllTraitValues(collection, 'Background'),
    Body: getAllTraitValues(collection, 'Body'),
    'Body color': getAllTraitValues(collection, 'Body color'),
    Head: getAllTraitValues(collection, 'Head'),
    Face: getAllTraitValues(collection, 'Face'),
    Eyes: getAllTraitValues(collection, 'Eyes'),
  }), [collection])

  const listingMap = useMemo(() => {
    const map = new Map<string, Listing>()
    listings.filter((l) => l.status === 'active').forEach((l) => map.set(l.inscriptionId, l))
    return map
  }, [listings])

  const filtered = useMemo(() => {
    let items = [...collection]
    if (activeTab === 'listed') items = items.filter((n) => listingMap.has(n.id))
    else if (activeTab === 'mine') {
      const ownedIds = new Set(wallet.ownedInscriptionIds)
      items = items.filter((n) => ownedIds.has(n.id))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter((n) =>
        n.meta.name.toLowerCase().includes(q) ||
        n.meta.attributes.some((a) => a.value.toLowerCase().includes(q))
      )
    }
    if (filters.background) items = items.filter((n) => getTrait(n, 'Background') === filters.background)
    if (filters.body) items = items.filter((n) => getTrait(n, 'Body') === filters.body)
    if (filters.bodyColor) items = items.filter((n) => getTrait(n, 'Body color') === filters.bodyColor)
    if (filters.head) items = items.filter((n) => getTrait(n, 'Head') === filters.head)
    if (filters.face) items = items.filter((n) => getTrait(n, 'Face') === filters.face)
    if (filters.eyes) items = items.filter((n) => getTrait(n, 'Eyes') === filters.eyes)
    switch (sort) {
      case 'rarity_asc': items.sort((a, b) => (a.rarityRank ?? 9999) - (b.rarityRank ?? 9999)); break
      case 'rarity_desc': items.sort((a, b) => (b.rarityRank ?? 0) - (a.rarityRank ?? 0)); break
      case 'price_asc': items.sort((a, b) => (listingMap.get(a.id)?.priceInSats ?? Infinity) - (listingMap.get(b.id)?.priceInSats ?? Infinity)); break
      case 'price_desc': items.sort((a, b) => (listingMap.get(b.id)?.priceInSats ?? 0) - (listingMap.get(a.id)?.priceInSats ?? 0)); break
      case 'number_asc': items.sort((a, b) => (a.number ?? 0) - (b.number ?? 0)); break
    }
    return items
  }, [collection, filters, sort, search, activeTab, wallet.ownedInscriptionIds, listingMap])

  const floorListing = useMemo(() => {
    const listed = listings.filter((l) => l.status === 'active')
    return listed.length ? listed.reduce((min, l) => l.priceInSats < min.priceInSats ? l : min, listed[0]) : null
  }, [listings])

  const activeListingsCount = listings.filter((l) => l.status === 'active').length
  const hasFilters = Object.values(filters).some(Boolean) || !!search || activeTab !== 'all'
  const clearFilters = () => { setFilters({}); setSearch(''); setActiveTab('all') }

  const S = {
    header: {
      position: 'sticky' as const, top: 0, zIndex: 40,
      background: 'linear-gradient(180deg, rgba(26,14,46,0.98) 0%, rgba(26,14,46,0.93) 100%)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(245,200,66,0.18)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    },
    input: {
      width: '100%',
      background: 'rgba(58,36,96,0.6)',
      border: '1px solid rgba(245,200,66,0.22)',
      borderRadius: 12,
      padding: '9px 16px 9px 36px',
      fontSize: 13,
      color: 'var(--text)',
      fontFamily: "'Space Mono', monospace",
      outline: 'none',
    },
    tabGroup: {
      display: 'flex',
      background: 'rgba(42,26,74,0.8)',
      border: '1px solid rgba(245,200,66,0.18)',
      borderRadius: 14, padding: 4, gap: 4,
    },
    tabActive: {
      padding: '7px 14px', borderRadius: 10, border: 'none', fontSize: 12,
      fontWeight: 800, cursor: 'pointer',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      background: 'linear-gradient(135deg, #f5c842, #ff9a3c)',
      color: '#1a0e2e',
      boxShadow: '0 0 14px rgba(245,200,66,0.5)',
    },
    tabInactive: {
      padding: '7px 14px', borderRadius: 10, border: 'none', fontSize: 12,
      fontWeight: 700, cursor: 'pointer',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      background: 'transparent', color: 'var(--muted)',
    },
    connectBtn: {
      background: 'linear-gradient(135deg, #f5c842, #ff9a3c)',
      color: '#1a0e2e', fontWeight: 800, fontSize: 13,
      padding: '9px 18px', borderRadius: 12, border: 'none',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      boxShadow: '0 0 20px rgba(245,200,66,0.4)',
    },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <SakuraPetals />

      {/* NAV */}
      <header style={S.header}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #f5c842, #ff8fa8, #f5c842, transparent)' }} />
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #f5c842, #ff9a3c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 22px rgba(245,200,66,0.5)' }}>🦝</div>
            <div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 17, fontWeight: 900, background: 'linear-gradient(135deg, #f5c842, #ff9a3c, #ff8fa8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.04em' }}>NookiMarket</div>
              <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.15em', fontFamily: 'monospace' }}>ビットコイン・オーディナルズ</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 420, position: 'relative', display: 'none' }} className="sm-block-search">
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
            <input type="text" placeholder="Search #number or trait..." value={search} onChange={(e) => setSearch(e.target.value)} style={S.input} />
          </div>

          {/* Wallet */}
          <div>
            {wallet.connected && wallet.addresses ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(78,203,160,0.1)', border: '1px solid rgba(78,203,160,0.4)', borderRadius: 10, padding: '6px 12px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ecba0', boxShadow: '0 0 8px #4ecba0' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#4ecba0' }}>{truncateAddress(wallet.addresses.ordinals)}</span>
                  {wallet.ownedNookis.length > 0 && <span style={{ fontSize: 11, color: '#f5c842', fontWeight: 800 }}>· {wallet.ownedNookis.length} 🦝</span>}
                </div>
                <button onClick={wallet.disconnect} style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
            ) : (
              <button onClick={() => setShowWalletModal(true)} style={S.connectBtn}>⚡ Connect Xverse</button>
            )}
          </div>
        </div>
      </header>

      {/* STATS */}
      <div style={{ borderBottom: '1px solid rgba(245,200,66,0.1)', background: 'rgba(30,16,53,0.7)' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 40, overflowX: 'auto' }}>
          {[
            { icon: '🏮', label: 'Collection', val: collection.length.toLocaleString() },
            { icon: '📜', label: 'Listed', val: activeListingsCount.toString() },
            { icon: '💰', label: 'Floor', val: floorListing ? satsToDisplay(floorListing.priceInSats) : '—' },
            ...(wallet.connected ? [{ icon: '🦝', label: 'My Nookis', val: wallet.isLoading ? '…' : wallet.ownedNookis.length.toString() }] : []),
          ].map((s) => (
            <div key={s.label} style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.12em', fontFamily: 'monospace', textTransform: 'uppercase' }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f5c842' }}>{s.val}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', textTransform: 'uppercase' }}>⛩ Network</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Bitcoin Mainnet</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, maxWidth: 1600, margin: '0 auto', width: '100%', padding: '24px 16px' }}>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* Mobile search */}
          <div style={{ width: '100%', position: 'relative', marginBottom: 8, display: 'block' }} className="mobile-search">
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13 }}>🔍</span>
            <input type="text" placeholder="Search #number or trait..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...S.input, display: 'block' }} className="hidden sm:block" />
          </div>

          <div style={S.tabGroup}>
            {(['all', 'listed', 'mine'] as const).map((tab) => {
              const label = { all: `✦ All (${collection.length.toLocaleString()})`, listed: `📜 Listed (${activeListingsCount})`, mine: `🦝 Mine (${wallet.connected ? (wallet.isLoading ? '…' : wallet.ownedNookis.length) : '?'})` }
              return (
                <button key={tab} onClick={() => { if (tab === 'mine' && !wallet.connected) { setShowWalletModal(true); return } setActiveTab(tab) }} style={activeTab === tab ? S.tabActive : S.tabInactive}>
                  {label[tab]}
                </button>
              )
            })}
          </div>

          <button onClick={() => setFilterOpen(!filterOpen)} style={{ padding: '8px 14px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 700, border: filterOpen ? '1px solid rgba(245,200,66,0.6)' : '1px solid rgba(245,200,66,0.2)', background: filterOpen ? 'rgba(245,200,66,0.1)' : 'rgba(42,26,74,0.6)', color: filterOpen ? '#f5c842' : 'var(--muted)', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
            ⛩ Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
          </button>

          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} style={{ background: 'rgba(42,26,74,0.8)', border: '1px solid rgba(245,200,66,0.2)', borderRadius: 12, padding: '8px 12px', fontSize: 12, color: 'var(--text)', cursor: 'pointer', fontFamily: 'monospace', outline: 'none' }}>
            <option value="rarity_asc">✦ Rarest First</option>
            <option value="rarity_desc">✦ Common First</option>
            <option value="price_asc">💰 Price ↑</option>
            <option value="price_desc">💰 Price ↓</option>
            <option value="number_asc"># Number ↑</option>
          </select>

          {hasFilters && <button onClick={clearFilters} style={{ fontSize: 11, color: '#ff8fa8', fontFamily: 'monospace', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>✕ clear</button>}
          <span style={{ marginLeft: hasFilters ? 0 : 'auto', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{filtered.length.toLocaleString()} nookis</span>
        </div>

        {filterOpen && <FilterPanel traitOptions={traitOptions} filters={filters} onChange={setFilters} />}

        {/* Loading state */}
        {activeTab === 'mine' && wallet.isLoading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, animation: 'float 2s ease-in-out infinite' }}>🦝</div>
            <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 13, marginTop: 16 }}>Summoning your Ordinookis from the blockchain…</p>
          </div>
        )}

        {/* Empty wallet state */}
        {activeTab === 'mine' && !wallet.isLoading && wallet.connected && wallet.ownedNookis.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56 }}>🏮</div>
            <p style={{ color: '#f5c842', fontWeight: 800, fontSize: 18, marginTop: 16 }}>No Ordinookis found in wallet</p>
            <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12, marginTop: 8 }}>Make sure your Xverse Taproot address holds the inscriptions</p>
          </div>
        )}

        {/* Grid */}
        {!(activeTab === 'mine' && wallet.isLoading) && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
            {filtered.slice(0, 120).map((nooki, i) => (
              <NookiCard key={nooki.id} nooki={nooki} listing={listingMap.get(nooki.id) ?? null} isOwned={wallet.ownedInscriptionIds.includes(nooki.id)} onClick={() => setSelectedNooki(nooki)} animDelay={i < 24 ? `${(i % 12) * 40}ms` : '0ms'} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !(activeTab === 'mine' && wallet.isLoading) && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 13, marginTop: 16 }}>No Ordinookis found</p>
            <button onClick={clearFilters} style={{ marginTop: 12, color: '#f5c842', fontFamily: 'monospace', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</button>
          </div>
        )}

        {filtered.length > 120 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11, marginTop: 28 }}>🌸 Showing 120 of {filtered.length} — use filters to narrow results</p>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(245,200,66,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', background: 'rgba(26,14,46,0.95)' }}>
        <span>🦝 NookiMarket · {collection.length.toLocaleString()} Ordinookis · Bitcoin Ordinals</span>
        <span>Xverse + sats-connect + Next.js ⛩</span>
      </footer>

      {/* Modals */}
      {selectedNooki && <NookiModal nooki={selectedNooki} listing={listingMap.get(selectedNooki.id) ?? null} wallet={wallet} isOwned={wallet.ownedInscriptionIds.includes(selectedNooki.id)} onClose={() => setSelectedNooki(null)} onListingChange={refreshListings} onConnectWallet={() => { setSelectedNooki(null); setShowWalletModal(true) }} />}
      {showWalletModal && <WalletModal wallet={wallet} onClose={() => setShowWalletModal(false)} />}
    </div>
  )
}
