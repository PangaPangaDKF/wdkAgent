# WDK Agent — Checklist de Progreso

## ✅ Lo que ya está hecho

### Infraestructura base
- [x] Proyecto creado en `/home/panga/wdkAgent/`
- [x] Estructura de carpetas: `src/agent/`, `src/tools/`, `src/blockchain/`, `src/x402/`, `src/cli/`, `src/demo/`
- [x] `package.json` configurado (dependencias: ethers, openai, express, axios)
- [x] `tsconfig.json` — TypeScript configurado
- [x] `.gitignore` — excluye `node_modules/` y `.env`
- [x] `npm install` — dependencias instaladas
- [x] `tsc --noEmit` — 0 errores de TypeScript

### Blockchain / Wallet
- [x] `src/blockchain/config.ts` — direcciones de contratos ArepaPay L1
- [x] `src/blockchain/wallet.ts` — wallet BIP-44 compatible con WDK (`m/44'/60'/0'/0/0`)
- [x] `src/blockchain/abis.ts` — ABIs mínimos de todos los contratos

### Herramientas del agente (12 tools)
- [x] `check_balance` — leer saldo USD₮, AREPA, tickets, minutos WiFi
- [x] `create_wallet` — crear nueva wallet HD compatible con WDK
- [x] `pay_merchant` — pagar comercio via PaymentProcessor
- [x] `activate_internet` — activar minutos WiFi on-chain
- [x] `get_market_prices` — comparar ArepaHub vs Binance P2P
- [x] `get_hub_liquidity` — liquidez disponible en ArepaHub
- [x] `execute_arbitrage` — ciclo de arbitraje automático
- [x] `inject_liquidity` — inyectar USD₮ al hub
- [x] `fetch_with_payment` — HTTP con auto-pago x402
- [x] `deposit_savings` — depositar USD₮ en SavingsVault para yield
- [x] `withdraw_savings` — retirar del vault
- [x] `get_savings_info` — posición actual en el vault

### Agente IA
- [x] `src/agent/index.ts` — agente con Gemini 2.0 Flash (OpenAI-compatible)
- [x] `src/agent/tools.ts` — definición de los 12 tools para Gemini

### Interfaces de usuario
- [x] `src/cli/demo.ts` — CLI directo (sin IA, sin API key)
- [x] `src/demo/server.ts` — servidor x402 demo (2 endpoints protegidos)

### Protocolo x402
- [x] `src/x402/client.ts` — cliente con auto-pago en HTTP 402
- [x] `src/x402/server.ts` — middleware Express para proteger endpoints
- [x] `src/x402/types.ts` — tipos TypeScript del protocolo

### Documentación
- [x] `README.md` — tabla Track 1 compliance, badges, arquitectura, comandos
- [x] `.env.example` — plantilla de configuración
- [x] `CLAUDE.md` — guía para desarrollo

### Git
- [x] Repositorio local inicializado (`git init`)
- [x] Commit inicial creado
- [x] Commit de mejoras (CLI + README)

---

## 🔄 En progreso ahora

- [ ] Crear repo en GitHub (`wdkAgent` público)
- [ ] Push del código a GitHub
- [ ] Agregar `GEMINI_API_KEY` al `.env`

---

## ⏳ Pendiente — para terminar el proyecto

### Pruebas funcionales
- [ ] `npm run cli` → verificar que todos los comandos responden
- [ ] `npm run demo` → servidor x402 levantado en puerto 3001
- [ ] `npm run dev` → agente Gemini responde con tool calls

### Demo secuencia completa (para el pitch)
- [ ] `balance` — muestra saldo USD₮ actual
- [ ] `wallet` — crea nueva wallet WDK
- [ ] `prices` — muestra spread ArepaHub vs Binance P2P
- [ ] `arbitrage` — ejecuta ciclo de arbitraje
- [ ] `deposit 100` — deposita en SavingsVault
- [ ] `savings` — muestra yield ganado
- [ ] `pay panaderia 5` — paga merchant on-chain
- [ ] `fetch http://localhost:3001/api/bcv-rate` — x402 auto-pago

### Hackathon submission
- [ ] Video demo grabado (máx 3 min)
- [ ] README final revisado
- [ ] Repo público con código limpio (sin `.env`, sin claves)
- [ ] Formulario de submission enviado

---

## 📁 Estructura final del proyecto

```
wdkAgent/
├── src/
│   ├── agent/
│   │   ├── index.ts        ← Gemini 2.0 Flash agent loop
│   │   └── tools.ts        ← 12 tool definitions
│   ├── blockchain/
│   │   ├── config.ts       ← contract addresses + USDT_DECIMALS
│   │   ├── wallet.ts       ← WDK-compatible BIP-44 wallet
│   │   └── abis.ts         ← minimal contract ABIs
│   ├── tools/
│   │   ├── dispatch.ts     ← routes tool calls to implementations
│   │   ├── checkBalance.ts
│   │   ├── payMerchant.ts
│   │   ├── activateInternet.ts
│   │   ├── arbitrage.ts
│   │   ├── wdkWallet.ts    ← create_wallet (WDK primitive)
│   │   └── savings.ts      ← SavingsVault yield tools
│   ├── x402/
│   │   ├── client.ts       ← auto-pay on HTTP 402
│   │   ├── server.ts       ← Express middleware
│   │   └── types.ts
│   ├── cli/
│   │   └── demo.ts         ← direct CLI (no AI needed)
│   └── demo/
│       └── server.ts       ← x402 protected demo server
├── .env                    ← YOUR KEYS (never commit this)
├── .env.example            ← template (safe to commit)
├── .gitignore
├── CHECKLIST.md            ← este archivo
├── README.md
├── package.json
└── tsconfig.json
```

---

## 🎯 Objetivo del hackathon

**Track 1 — Agent Wallets (WDK)**

El agente demuestra que puede:
1. **Crear wallets** usando primitivos WDK (BIP-44)
2. **Mantener y enviar USD₮** de forma autónoma
3. **Razonar** con un LLM (Gemini 2.0 Flash) sobre cuándo actuar
4. **Operar con seguridad** (límites diarios, protección contra replay)
5. **Componerse** con otros protocolos (x402, ArepaHub, SavingsVault)
