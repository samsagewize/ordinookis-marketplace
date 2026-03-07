'use client'

import type { Filters } from '@/types'

interface Props {
  traitOptions: Record<string, string[]>
  filters: Filters
  onChange: (f: Filters) => void
}

const TRAIT_TO_KEY: Record<string, keyof Filters> = {
  Background: 'background',
  Body: 'body',
  'Body color': 'bodyColor',
  Head: 'head',
  Face: 'face',
  Eyes: 'eyes',
}

const TRAIT_ICONS: Record<string, string> = {
  Background: '🌅', Body: '👘', 'Body color': '🎨', Head: '🎩', Face: '😶', Eyes: '👁',
}

export default function FilterPanel({ traitOptions, filters, onChange }: Props) {
  function setFilter(trait: string, value: string) {
    const key = TRAIT_TO_KEY[trait]
    if (!key) return
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value })
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(42,26,74,0.9), rgba(30,16,53,0.9))',
      border: '1px solid rgba(245,200,66,0.18)',
      borderRadius: 16, padding: 20, marginBottom: 20,
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      animation: 'fade-up 0.3s cubic-bezier(.22,1,.36,1) forwards',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {Object.entries(traitOptions).map(([trait, values]) => {
          const key = TRAIT_TO_KEY[trait]
          const selected = key ? filters[key] : undefined
          return (
            <div key={trait}>
              <h4 style={{ fontSize: 10, fontFamily: 'monospace', color: '#f5c842', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                {TRAIT_ICONS[trait]} {trait}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 160, overflowY: 'auto' }}>
                {values.map((v) => (
                  <button key={v} onClick={() => setFilter(trait, v)} style={{
                    textAlign: 'left', fontSize: 11, fontFamily: 'monospace',
                    padding: '5px 9px', borderRadius: 7, cursor: 'pointer',
                    background: selected === v ? 'rgba(245,200,66,0.15)' : 'transparent',
                    color: selected === v ? '#f5c842' : 'var(--muted)',
                    border: selected === v ? '1px solid rgba(245,200,66,0.4)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { if (selected !== v) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(58,36,96,0.6)' } }}
                  onMouseLeave={(e) => { if (selected !== v) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
