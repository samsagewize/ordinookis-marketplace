'use client'

import { useState } from 'react'
import type { Ordinooki, Listing } from '@/types'
import { getTrait, satsToDisplay } from '@/lib/collection'

interface Props {
  nooki: Ordinooki
  listing: Listing | null
  isOwned: boolean
  onClick: () => void
  animDelay?: string
}

const BG_GRADIENTS: Record<string, [string, string]> = {
  Gray:         ['#3d3d55', '#1a1a2e'],
  Blue:         ['#1a3a8f', '#0d1f52'],
  Scarlet:      ['#8f1a2a', '#4a0d14'],
  Peach:        ['#c47a3a', '#7a4a1a'],
  Mint:         ['#1a7a5a', '#0d4a34'],
  'BTC Orange': ['#c47a1a', '#7a4a0d'],
  'Pastel Pink':['#c45a7a', '#7a2a4a'],
  Altered:      ['#5a1a9f', '#2a0d5a'],
  Lilac:        ['#7a5ac4', '#3a2a7a'],
}

const RARE_EYES = new Set(['Laser Eyes', 'Purple Power Up', 'Green Power Up', 'Altered', 'Future Shades'])

// Multiple CDN sources for best image quality
function getImageUrls(inscriptionId: string): string[] {
  return [
    `https://api.hiro.so/ordinals/v1/inscriptions/${inscriptionId}/content`,
    `https://ordinals.com/content/${inscriptionId}`,
    `https://ord.io/${inscriptionId}`,
  ]
}

export default function NookiCard({ nooki, listing, isOwned, onClick, animDelay }: Props) {
  const [imgSrc, setImgSrc] = useState(getImageUrls(nooki.id)[0])
  const [imgFallbackIdx, setImgFallbackIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const bg = getTrait(nooki, 'Background')
  const eyes = getTrait(nooki, 'Eyes')
  const head = getTrait(nooki, 'Head')
  const [c1, c2] = BG_GRADIENTS[bg] ?? ['#3a1a5a', '#1a0e2e']
  const isRareEyes = RARE_EYES.has(eyes)
  const rank = nooki.rarityRank
  const isTop100 = rank && rank <= 100
  const isTop500 = rank && rank <= 500

  function handleImgError() {
    const urls = getImageUrls(nooki.id)
    const nextIdx = imgFallbackIdx + 1
    if (nextIdx < urls.length) {
      setImgFallbackIdx(nextIdx)
      setImgSrc(urls[nextIdx])
    } else {
      setImgFailed(true)
    }
  }

  return (
    <div
      onClick={onClick}
      className="animate-fade-up"
      style={{
        animationDelay: animDelay ?? '0ms',
        cursor: 'pointer',
        borderRadius: 16,
        overflow: 'hidden',
        border: isOwned
          ? '2px solid rgba(78,203,160,0.7)'
          : isTop100
          ? '2px solid rgba(245,200,66,0.8)'
          : '1px solid rgba(245,200,66,0.14)',
        background: 'rgba(42,26,74,0.7)',
        transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
        boxShadow: isOwned
          ? '0 0 20px rgba(78,203,160,0.2)'
          : isTop100
          ? '0 0 20px rgba(245,200,66,0.25)'
          : '0 4px 16px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-5px) scale(1.02)'
        el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 30px rgba(245,200,66,0.2)'
        el.style.borderColor = 'rgba(245,200,66,0.6)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'none'
        el.style.boxShadow = isOwned ? '0 0 20px rgba(78,203,160,0.2)' : isTop100 ? '0 0 20px rgba(245,200,66,0.25)' : '0 4px 16px rgba(0,0,0,0.3)'
        el.style.borderColor = isOwned ? 'rgba(78,203,160,0.7)' : isTop100 ? 'rgba(245,200,66,0.8)' : 'rgba(245,200,66,0.14)'
      }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {isTop100 && (
          <span style={{ background: 'linear-gradient(135deg, #f5c842, #ff9a3c)', color: '#1a0e2e', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 5, fontFamily: 'monospace', boxShadow: '0 0 10px rgba(245,200,66,0.5)' }}>
            ★ TOP {rank}
          </span>
        )}
        {isOwned && (
          <span style={{ background: 'linear-gradient(135deg, #4ecba0, #00e5a0)', color: '#0a1a12', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 5, fontFamily: 'monospace' }}>
            ✓ OWNED
          </span>
        )}
        {listing && (
          <span style={{ background: 'rgba(26,14,46,0.85)', border: '1px solid rgba(245,200,66,0.5)', color: '#f5c842', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 5, fontFamily: 'monospace' }}>
            FOR SALE
          </span>
        )}
      </div>

      {/* Image */}
      <div style={{
        aspectRatio: '1',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} className="nft-img-wrap">
        {!imgFailed ? (
          <>
            {!imgLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, animation: 'float 2s ease-in-out infinite' }}>
                🦝
              </div>
            )}
            <img
              src={imgSrc}
              alt={nooki.meta.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
                // Best quality rendering for pixel art
                imageRendering: 'pixelated',
              }}
            />
          </>
        ) : (
          // Full fallback card with trait colors
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 16 }}>
            <span style={{ fontSize: 40 }}>🦝</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>#{nooki.number}</span>
          </div>
        )}

        {/* Laser eyes glow overlay */}
        {isRareEyes && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(255,50,50,0.15))', pointerEvents: 'none' }} />
        )}
        {/* Top trait shimmer on hover */}
        {isTop100 && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245,200,66,0.08), transparent)', pointerEvents: 'none' }} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
            #{nooki.number}
          </span>
          {rank && (
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: rank <= 100 ? '#f5c842' : rank <= 500 ? '#ff8fa8' : 'var(--muted)', fontWeight: 700 }}>
              R#{rank}
            </span>
          )}
        </div>

        {/* Trait pills */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {head !== 'none' && head !== 'head' && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', background: 'rgba(58,36,96,0.8)', color: 'var(--muted)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(245,200,66,0.1)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {head}
            </span>
          )}
          {isRareEyes && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', background: 'rgba(150,30,30,0.4)', color: '#ff8fa8', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,100,100,0.2)' }}>
              {eyes}
            </span>
          )}
        </div>

        {/* Price / status */}
        {listing ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#f5c842', fontWeight: 800, fontSize: 13 }}>{satsToDisplay(listing.priceInSats)}</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#4ecba0', background: 'rgba(78,203,160,0.1)', border: '1px solid rgba(78,203,160,0.3)', padding: '2px 7px', borderRadius: 5 }}>BUY</span>
          </div>
        ) : (
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(184,160,208,0.5)' }}>
            {isOwned ? '— your nooki —' : 'not listed'}
          </div>
        )}
      </div>
    </div>
  )
}
