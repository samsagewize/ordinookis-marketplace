# 🦝 NookiMarket — Ordinookis on Bitcoin

> A non-custodial Bitcoin Ordinals marketplace for the Ordinookis collection.  
> Built with **Next.js 14 · Xverse Wallet · sats-connect · Hiro Ordinals API**

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org) — check with `node --version`
- [Git](https://git-scm.com/downloads)
- [Xverse Wallet](https://www.xverse.app) browser extension

### Clone & Run

```bash
git clone https://github.com/YOUR_USERNAME/ordinookis-marketplace.git
cd ordinookis-marketplace
npm install
npm run dev
# Open http://localhost:3000
```

The full collection of 2,907 Ordinookis is bundled in `public/data/ordinookis.json` — no API keys needed to run locally.

---

## 👥 Adding a Co-Developer

### Step 1 — Push to GitHub (repo owner, one time)

```bash
git init
git add .
git commit -m "🦝 initial commit — nooki market"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ordinookis-marketplace.git
git push -u origin main
```

### Step 2 — Invite collaborator

1. GitHub repo → **Settings** → **Collaborators** → **Add people**
2. Enter friend's GitHub username → he accepts email invite
3. He now has full push access

### Step 3 — Friend clones & runs

```bash
git clone https://github.com/YOUR_USERNAME/ordinookis-marketplace.git
cd ordinookis-marketplace
npm install
npm run dev
```

### Step 4 — Deploy shared URL on Vercel

1. [vercel.com](https://vercel.com) → sign in with GitHub → import this repo
2. Deploy → get a live URL to share with your friend
3. Every `git push` to `main` auto-redeploys

---

## 🔄 Daily Git Workflow

```bash
# Start every session with:
git pull origin main

# After making changes:
git add .
git commit -m "feat: what you built"
git push origin main
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + fonts
│   ├── page.tsx                # Server component — loads collection
│   └── globals.css             # Tanuki/anime theme
├── components/
│   ├── MarketplaceClient.tsx   # Main app shell
│   ├── NookiCard.tsx           # Gallery card
│   ├── NookiModal.tsx          # Trade modal (list/buy/offer)
│   ├── WalletModal.tsx         # Xverse connect
│   ├── FilterPanel.tsx         # Trait filters
│   └── StatsBar.tsx            # Stats header
├── hooks/
│   └── useXverseWallet.ts      # Wallet + Hiro API ownership detection
├── lib/
│   ├── collection.ts           # Rarity engine + helpers
│   ├── store.ts                # localStorage listings/offers
│   └── psbt.ts                 # PSBT utils + fee estimation
└── types/
    └── index.ts                # TypeScript types
public/
└── data/
    └── ordinookis.json         # 2,907 Ordinookis collection
```

---

## 🔗 Xverse Wallet — Ownership Detection

The hook queries Hiro's API with your **Taproot address** (`bc1p...`):

```
GET https://api.hiro.so/ordinals/v1/inscriptions?address=bc1p...
```

If "My Nookis" shows empty:
1. Copy your `bc1p...` address from Xverse
2. Verify at [ordiscan.com](https://ordiscan.com) that your Nookis show there
3. Test: `https://api.hiro.so/ordinals/v1/inscriptions?address=YOUR_BC1P_ADDRESS`

---

## 🗺 Roadmap

- [x] Xverse wallet connect (Taproot + Segwit)
- [x] Full collection gallery with rarity scoring
- [x] Trait filtering + sorting
- [x] Listing flow
- [x] Ordiscan iframe in modal
- [x] Anime tanuki theme 🦝
- [ ] `/api/build-psbt` — real on-chain atomic swaps
- [ ] Supabase backend — shared listings
- [ ] Activity feed

## 📄 License

MIT
