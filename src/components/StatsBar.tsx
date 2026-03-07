'use client'

interface Props {
  total: number
  listed: number
  floor: string
  owned: number
  walletConnected: boolean
}

export default function StatsBar({ total, listed, floor, owned, walletConnected }: Props) {
  const stats = [
    { label: 'Collection Size', value: total.toLocaleString() },
    { label: 'Active Listings', value: listed.toString() },
    { label: 'Floor Price', value: floor },
    ...(walletConnected ? [{ label: 'My Nookis', value: owned.toString() }] : []),
  ]

  return (
    <div className="border-b border-[#2a2a3d] bg-[#12121a]">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-8 overflow-x-auto">
        {stats.map((s, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="text-[10px] font-mono text-[#6b6b8a] uppercase tracking-widest">{s.label}</div>
            <div className="text-lg font-black text-btc">{s.value}</div>
          </div>
        ))}
        <div className="ml-auto flex-shrink-0 hidden sm:block">
          <div className="text-[10px] font-mono text-[#6b6b8a] uppercase tracking-widest">Network</div>
          <div className="text-sm font-bold text-[#e8e8f0]">Bitcoin Mainnet</div>
        </div>
      </div>
    </div>
  )
}
