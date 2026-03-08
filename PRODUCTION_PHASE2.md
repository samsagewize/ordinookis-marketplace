# Production Phase 2 (foundation started)

## Implemented now
- Added server preflight endpoint: `POST /api/trade/preflight`
  - verifies inscription UTXO exists on-chain
  - verifies buyer payment UTXO can cover price + fee + dust
- Added server broadcast endpoint: `POST /api/trade/broadcast`
  - relays signed tx hex to mempool.space
- Added live listing endpoint: `POST /api/trade/listing`
  - requires `signedPsbt` for live listings
  - verifies inscription UTXO before persisting listing
- Added finalize endpoint: `POST /api/trade/finalize`
  - validates active listing + seller PSBT presence
  - validates buyer payment UTXO plan
  - blocks with `501` until PSBT engine is enabled
- Buy UI now uses server preflight + finalize endpoints.
- Listing UI now supports signed PSBT input when live mode is enabled.

## Still required to complete true live trading
1. Server-side PSBT builder for sellers (instead of manual signed PSBT paste).
2. Implement bitcoinjs-lib finalize engine in `/api/trade/finalize`.
3. Wallet signing flow for buyer finalized PSBT + `/api/trade/broadcast`.
4. Persist listing/order state in production DB (Supabase/Postgres).
