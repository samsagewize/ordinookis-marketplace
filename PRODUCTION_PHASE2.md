# Production Phase 2 (foundation started)

## Implemented now
- Added server preflight endpoint: `POST /api/trade/preflight`
  - verifies inscription UTXO exists on-chain
  - verifies buyer payment UTXO can cover price + fee + dust
- Added server broadcast endpoint: `POST /api/trade/broadcast`
  - relays signed tx hex to mempool.space
- Buy UI now uses server preflight instead of client-only checks.
- Buy flow is hard-blocked unless:
  - `NEXT_PUBLIC_ENABLE_LIVE_TRADES=true`
  - listing contains `signedPsbt`

## Still required to complete true live trading
1. Listing endpoint to build seller PSBT and store `signedPsbt`.
2. Buy endpoint to merge seller PSBT + buyer inputs, return unsigned/finalizable PSBT.
3. Wallet signing flow for buyer PSBT + broadcast call.
4. Persist listing/order state in production DB (Supabase/Postgres).
