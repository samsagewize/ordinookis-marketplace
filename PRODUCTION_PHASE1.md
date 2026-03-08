# Production Phase 1 (implemented)

This phase removes unsafe demo behavior and adds production-safe guardrails.

## Done
- Shared listings are server-backed (`/api/test-listings`) instead of browser-only localStorage.
- Buy flow no longer generates fake txids or marks fake sales.
- Buy preflight validates:
  - inscription UTXO exists on-chain
  - buyer has sufficient payment UTXO
- If live trading backend is not enabled, UI returns a clear blocking error.

## Runtime flag
- `NEXT_PUBLIC_ENABLE_LIVE_TRADES=true` enables live-trade path gate.
- Current code still requires Phase 2 backend endpoints for real PSBT build/broadcast.

## Phase 2 required for true production
- Server API to build seller/buyer PSBT
- Xverse signing payload integration
- Real tx broadcast + confirmations
- Durable DB (Supabase/Postgres) + auth + audit trail
