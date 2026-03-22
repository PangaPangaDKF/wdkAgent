# WDK Agent

Autonomous agent wallet built on Tether's WDK primitives. Runs on ArepaPay L1 (Avalanche subnet, Chain ID 13370) and manages USD₮ without human intervention.

Uses Gemini 2.0 Flash (free) for reasoning. Wallets follow BIP-44 derivation — same standard as Tether's Wallet Development Kit.

---

## What it does

- Creates WDK-compatible HD wallets on demand
- Sends and manages USD₮ autonomously
- Executes arbitrage between ArepaHub internal rate and Binance P2P market
- Deposits USD₮ into SavingsVault for yield (sUSDT)
- Pays merchants via PaymentProcessor (auto-mints raffle tickets + WiFi minutes)
- Fetches x402-gated HTTP resources and auto-pays when HTTP 402 is returned
- Activates WiFi internet vouchers on-chain

---

## Setup

```bash
cp .env.example .env
npm install
```

```bash
# .env — wallet
WDK_SEED=word1 word2 ... word12

# .env — LLM (gratis en aistudio.google.com)
GEMINI_API_KEY=AIza...

# .env — red
RPC_URL=http://127.0.0.1:9650/ext/bc/24KtPXNgmHT2vVUPK1rx72ykjKwHBdfGrQr5bwJxmuaEBm5Fpx/rpc
CHAIN_ID=13370
PORT=3001
```

```bash
# Terminal 1 — demo server x402
npm run demo

# Terminal 2 — agente IA
npm run dev

# Terminal 2 (alternativa) — CLI directo sin IA
npm run cli
```

---

## Comandos CLI

```
wdk> balance
wdk> pay panaderia 5
wdk> prices
wdk> arbitrage
wdk> deposit_savings 100
wdk> savings
wdk> internet 30
wdk> fetch http://localhost:3001/api/bcv-rate
```

Con el agente IA:

```
crea una nueva wallet
cuál es mi balance?
deposita 50 USDT en savings
hay oportunidad de arbitraje?
paga 10 a la panaderia
activa 30 minutos de internet
fetch http://localhost:3001/api/bcv-rate
```

---

## Contratos en ArepaPay L1

Chain ID 13370

| Contrato | Dirección |
|----------|-----------|
| MockUSDT | `0x29D720D6b5837f2b9d66834246635a4d8BC00d18` |
| PaymentProcessor | `0xc09b059534D779f500B94f0DdC677765eEb5674b` |
| MerchantRegistry | `0x252148C81c16ab7f7ec59521E9524b94bfe0e29c` |
| ArepaHub | `0xCfEfB29bD69C0af628A1D206c366133629011820` |
| SavingsVault | `0x7E9f6077c092b20f3b4475aE3253AC1791C7e7b0` |
| OTCMarket | `0x53ac07432c22eEe0Ee6cE5c003bf198F4712BC0B` |
| InternetVoucher | `0xCf939a5A6da5D022f2231DCE65DCaCd7Aeac1c46` |
| RewardTicket | `0x6ACC6A8e1146137976eA8ae1043F0D4A8273C1F9` |

Merchants: `panaderia`, `botellones`, `perros`, `bodega`

---

## Track 1 — Agent Wallets (Tether Hackathon)

| Requirement | Status |
|-------------|--------|
| Agent framework for reasoning | ✅ Gemini 2.0 Flash via OpenAI-compatible API |
| WDK primitives (wallet creation, signing) | ✅ BIP-44 `m/44'/60'/0'/0/0` — WDK-compatible |
| Agent holds/sends/manages USD₮ autonomously | ✅ Live on ArepaPay L1 |
| Separation: agent logic vs wallet execution | ✅ `src/agent/` vs `src/blockchain/` |
| Safety: limits and replay protection | ✅ ERC-8004 daily budget, nonce-based protection |
| Open-source LLM | ✅ Gemini 2.0 Flash (bonus) |
| Composability | ✅ x402 + ArepaHub + SavingsVault (bonus) |
