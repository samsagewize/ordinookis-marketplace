'use client'

import type { UseWalletReturn } from '@/hooks/useXverseWallet'
import { truncateAddress } from '@/lib/collection'

interface Props {
  wallet: UseWalletReturn
  onClose: () => void
}

export default function WalletModal({ wallet, onClose }: Props) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(10,5,20,0.82)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'linear-gradient(160deg,#2a1a4a 0%,#1a0e2e 100%)',
        border: '1px solid rgba(245,200,66,0.25)', borderRadius: 22,
        width: '100%', maxWidth: 390,
        boxShadow: '0 24px 60px rgba(0,0,0,0.65),0 0 40px rgba(245,200,66,0.07)',
        overflow: 'hidden',
        animation: 'fade-up 0.35s cubic-bezier(.22,1,.36,1) forwards',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,rgba(245,200,66,0.1),rgba(255,143,168,0.05))', padding: '22px 22px 18px', borderBottom: '1px solid rgba(245,200,66,0.12)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#f5c842,#ff8fa8,#f5c842,transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#f5c842,#ff8fa8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {wallet.connected ? '🦝 Wallet Connected' : '⚡ Connect Wallet'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 3, letterSpacing: '0.1em' }}>
                {wallet.connected ? 'ウォレット接続済み' : 'ウォレットを接続する'}
              </div>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(58,36,96,0.8)', border: '1px solid rgba(245,200,66,0.15)', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {wallet.connected && wallet.addresses ? (
            /* ── CONNECTED STATE ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Ordinals address */}
              <div style={{ background: 'rgba(42,26,74,0.6)', border: '1px solid rgba(245,200,66,0.12)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>🎨 Ordinals Address (Taproot)</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#4ecba0', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {wallet.addresses.ordinals}
                </div>
              </div>

              {/* Payment address */}
              <div style={{ background: 'rgba(42,26,74,0.6)', border: '1px solid rgba(245,200,66,0.12)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>💸 Payment Address (Segwit)</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#f5c842', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {wallet.addresses.payment}
                </div>
              </div>

              {/* Nooki count */}
              {wallet.isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(42,26,74,0.4)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 20, animation: 'float 1.8s ease-in-out infinite' }}>🌸</div>
                  <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12 }}>Fetching your Ordinookis…</span>
                </div>
              ) : (
                <div style={{ background: wallet.ownedNookis.length > 0 ? 'rgba(245,200,66,0.08)' : 'rgba(42,26,74,0.4)', border: `1px solid ${wallet.ownedNookis.length > 0 ? 'rgba(245,200,66,0.25)' : 'rgba(245,200,66,0.08)'}`, borderRadius: 12, padding: '12px 14px' }}>
                  {wallet.ownedNookis.length > 0 ? (
                    <div>
                      <span style={{ color: '#f5c842', fontWeight: 800, fontSize: 18 }}>🦝 {wallet.ownedNookis.length} Ordinookis</span>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}> found in wallet</span>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 4 }}>
                        Click "My Nookis" tab to view them
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>No Ordinookis found at this address</div>
                      <div style={{ fontSize: 10, color: 'rgba(184,160,208,0.5)', fontFamily: 'monospace', lineHeight: 1.6 }}>
                        Make sure your Xverse Taproot address holds the inscriptions. Check Ordiscan to confirm.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {wallet.error && (
                <div style={{ background: 'rgba(150,30,30,0.2)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ color: '#ff8fa8', fontFamily: 'monospace', fontSize: 11 }}>⚠️ {wallet.error}</p>
                </div>
              )}

              {/* Refresh button */}
              <button
                onClick={() => (wallet as typeof wallet & { refreshNookis: () => Promise<void> }).refreshNookis?.()}
                disabled={wallet.isLoading}
                style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid rgba(245,200,66,0.25)', background: 'rgba(245,200,66,0.06)', color: '#f5c842', fontWeight: 700, cursor: wallet.isLoading ? 'not-allowed' : 'pointer', fontSize: 13, opacity: wallet.isLoading ? 0.5 : 1 }}
              >
                {wallet.isLoading ? '⏳ Refreshing…' : '🔄 Refresh Nookis'}
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={wallet.disconnect} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)', background: 'transparent', color: '#ff8fa8', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  Disconnect
                </button>
                <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', color: '#1a0e2e', fontWeight: 800, cursor: 'pointer', fontSize: 13, border: 'none' }}>
                  Done ✓
                </button>
              </div>
            </div>
          ) : (
            /* ── CONNECT STATE ── */
            <>
              <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
                Connect your Xverse wallet to view your Ordinookis and start trading
              </p>

              {/* Xverse button */}
              <button
                onClick={wallet.connect}
                disabled={wallet.isLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(58,36,96,0.5)', border: '1px solid rgba(245,200,66,0.22)', borderRadius: 14, padding: '14px 16px', cursor: wallet.isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: wallet.isLoading ? 0.7 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,200,66,0.6)'; e.currentTarget.style.background = 'rgba(78,48,126,0.6)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,200,66,0.22)'; e.currentTarget.style.background = 'rgba(58,36,96,0.5)' }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#f5c842,#ff9a3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 0 16px rgba(245,200,66,0.3)' }}>₿</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 15 }}>Xverse Wallet</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 2 }}>Best wallet for Bitcoin Ordinals</div>
                </div>
                <div style={{ color: '#f5c842', fontSize: 20 }}>{wallet.isLoading ? '⏳' : '→'}</div>
              </button>

              {wallet.error && (
                <div style={{ background: 'rgba(150,30,30,0.3)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ color: '#ff8fa8', fontFamily: 'monospace', fontSize: 11 }}>{wallet.error}</p>
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(245,200,66,0.1)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 11, textAlign: 'center' }}>Don't have Xverse?</p>
                <a href="https://www.xverse.app" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', border: '1px solid rgba(245,200,66,0.25)', color: '#f5c842', padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', background: 'rgba(245,200,66,0.05)' }}>
                  Download Xverse ↗
                </a>
              </div>

              <p style={{ fontSize: 9, color: 'rgba(184,160,208,0.35)', fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.7 }}>
                Non-custodial · We never hold your keys · All trades are on-chain Bitcoin PSBTs
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
