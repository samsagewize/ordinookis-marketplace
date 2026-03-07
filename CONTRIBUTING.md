# Contributing to NookiMarket 🦝

Welcome to the team! This guide gets you set up and explains how we work together.

---

## Getting Started

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/ordinookis-marketplace.git
cd ordinookis-marketplace

# Install
npm install

# Run
npm run dev
# → http://localhost:3000
```

No `.env` file needed for local dev. Everything works out of the box.

---

## File Ownership

To avoid merge conflicts, we each own specific files:

| File | Owner |
|------|-------|
| `NookiModal.tsx` | Trade flows (list/buy/offer logic) |
| `useXverseWallet.ts` | Wallet + ownership detection |
| `MarketplaceClient.tsx` | Main layout + tabs |
| `NookiCard.tsx` | Gallery card UI |
| `FilterPanel.tsx` | Trait filters |
| `globals.css` | Theme variables |

Talk in Discord/DM before both touching the same file.

---

## Git Workflow

```bash
# 1. Always pull first
git pull origin main

# 2. Make your changes

# 3. Commit with a clear message
git add .
git commit -m "feat: add rarity badge to cards"
# or: "fix: wallet not loading on Safari"
# or: "style: tighten card spacing"

# 4. Push
git push origin main
```

### Commit message prefixes:
- `feat:` — new feature
- `fix:` — bug fix  
- `style:` — UI/CSS only
- `refactor:` — code cleanup, no behavior change
- `docs:` — readme/comments

---

## If You Get a Merge Conflict

```bash
git pull origin main
# Git tells you which files have conflicts
# Open the file — look for <<<<<<< markers
# Keep the right code, delete the markers
git add .
git commit -m "fix: resolve merge conflict in NookiCard"
git push origin main
```

---

## Branch Strategy (Optional, for bigger changes)

```bash
# Create a branch for a big feature
git checkout -b feat/supabase-backend

# Work on it, then push
git push origin feat/supabase-backend

# Open a Pull Request on GitHub to merge into main
```

For small fixes, pushing directly to `main` is fine.

---

## Testing Checklist Before Pushing

- [ ] `npm run build` passes (no TypeScript errors)
- [ ] Wallet connects without console errors
- [ ] My Nookis tab loads (or shows correct empty state)
- [ ] Cards display images (or fallback tanuki 🦝)
- [ ] Modal opens + closes cleanly

---

## Questions?

Open an [Issue](../../issues) on GitHub or DM directly.
