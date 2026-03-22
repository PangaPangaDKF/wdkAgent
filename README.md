# 💳 wdkAgent

**Autonomous USD₮ Agent for Tether's WDK — Hackathon Track 1 Submission**

[![Track](https://img.shields.io/badge/Track-1_WDK_Agent-blue)](#)
[![LLM](https://img.shields.io/badge/LLM-Llama_3.3_70B_(Groq)-green)](#)
[![Network](https://img.shields.io/badge/Network-ArepaPay_L1-red)](#)
[![License](https://img.shields.io/badge/License-MIT-gray)](#)

---

## 🎯 Track 1 Compliance: Agent Wallets (WDK)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| WDK primitives (wallet creation, signing) | ✅ | `src/blockchain/wallet.ts` — BIP-44 `m/44'/60'/0'/0/0` via ethers v6 |
| Agent holds USD₮ | ✅ | `check_balance` reads USDT on-chain |
| Agent sends USD₮ | ✅ | `pay_merchant`, `x402`, `deposit_savings` execute transfers |
| Agent reasoning framework | ✅ | Llama 3.3 70B via Groq (OpenAI-compatible) |
| Safety: limits & replay protection | ✅ | ERC-8004 daily budget, nonce-based protection in ArepaAgent.sol |
| Separation: agent logic vs wallet execution | ✅ | `src/agent/` vs `src/blockchain/` |
| Open-source LLM | ✅ | Llama 3.3 70B (free via Groq, no credit card) — **Bonus** |
| Composability | ✅ | x402 + ArepaHub + SavingsVault + OTCMarket — **Bonus** |

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/PangaPangaDKF/wdkAgent
cd wdkAgent
npm install

# 2. Configure
cp .env.example .env
# Edit: WDK_SEED + GROQ_API_KEY (free at console.groq.com → API Keys)

# 3. Run
npm run demo         # Terminal 1 — x402 demo server
npm run dev          # Terminal 2 — Gemini agent (natural language)
npm run cli          # Terminal 2 (alt) — Direct commands, no AI
```

---

## 🤖 What the agent does

- **Creates WDK wallets** on demand — BIP-44 HD wallets, same standard as Tether WDK
- **Manages USD₮ autonomously** — holds, sends, checks balances on-chain
- **Executes arbitrage** — compares ArepaHub internal rate vs Binance P2P, trades when spread > 3%
- **Earns yield** — deposits USD₮ into SavingsVault (sUSDT), profits from arbitrage cycles
- **Pays merchants** — via PaymentProcessor, auto-mints raffle tickets + WiFi minutes
- **x402 auto-payments** — HTTP 402 → pays on-chain → retries automatically

---

## 💬 Agent commands (natural language)

```
crea una nueva wallet
cuál es mi balance?
hay oportunidad de arbitraje?
deposita 100 USDT en savings
cuánto yield tengo?
paga 5 a la panaderia
activa 30 minutos de internet
fetch http://localhost:3001/api/bcv-rate
```

## ⌨️ CLI commands (sin IA)

```
wdk> balance
wdk> wallet
wdk> pay panaderia 5
wdk> prices
wdk> arbitrage
wdk> savings
wdk> deposit 100
wdk> withdraw 50
wdk> internet 30
wdk> fetch http://localhost:3001/api/bcv-rate
```

---

## 🏗️ Architecture

```
User / Agent
    ↓
src/agent/index.ts       ← Gemini 2.0 Flash reasoning loop
    ↓
src/tools/dispatch.ts    ← 12 tools dispatcher
    ↓
┌─────────────────────────────────────────────┐
│ Tools                                       │
│ check_balance · create_wallet               │
│ pay_merchant · activate_internet            │
│ execute_arbitrage · inject_liquidity        │
│ deposit_savings · withdraw_savings          │
│ get_savings_info · get_market_prices        │
│ get_hub_liquidity · fetch_with_payment      │
└─────────────────────────────────────────────┘
    ↓
src/blockchain/wallet.ts  ← WDK-compatible BIP-44 signer
    ↓
ArepaPay L1 (Chain ID 13370)
```

---

## 📋 Contracts — ArepaPay L1

| Contract | Address |
|----------|---------|
| MockUSDT | `0x29D720D6b5837f2b9d66834246635a4d8BC00d18` |
| PaymentProcessor | `0xc09b059534D779f500B94f0DdC677765eEb5674b` |
| MerchantRegistry | `0x252148C81c16ab7f7ec59521E9524b94bfe0e29c` |
| ArepaHub | `0xCfEfB29bD69C0af628A1D206c366133629011820` |
| SavingsVault | `0x7E9f6077c092b20f3b4475aE3253AC1791C7e7b0` |
| OTCMarket | `0x53ac07432c22eEe0Ee6cE5c003bf198F4712BC0B` |
| InternetVoucher | `0xCf939a5A6da5D022f2231DCE65DCaCd7Aeac1c46` |
| RewardTicket | `0x6ACC6A8e1146137976eA8ae1043F0D4A8273C1F9` |

Merchants: `panaderia` · `botellones` · `perros` · `bodega`
