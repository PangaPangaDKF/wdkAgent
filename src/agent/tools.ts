/**
 * Tool definitions for WDK Agent (Tether Hackathon — Track 1: Agent Wallets).
 * 12 tools: 8 core ArepaPay tools + 4 new WDK/DeFi tools.
 */

import type { ChatCompletionTool } from "openai/resources/chat/completions";

export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "check_balance",
      description:
        "Check USD₮ balance, native gas balance, raffle tickets, and internet minutes for a wallet. Defaults to the agent's own wallet.",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "Wallet address to check. Optional — defaults to agent wallet.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_wallet",
      description:
        "Create a new WDK-compatible HD wallet using BIP-44 derivation (m/44'/60'/0'/0/0). Returns address and mnemonic seed phrase. The agent can use this to create wallets for users or sub-agents.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "pay_merchant",
      description:
        "Pay a verified ArepaPay merchant using USD₮ via PaymentProcessor. Auto-mints 1 raffle ticket and 30 WiFi minutes for the payer.",
      parameters: {
        type: "object",
        properties: {
          merchant_id: {
            type: "string",
            description: "Known merchant ID: 'panaderia', 'botellones', 'perros', or 'bodega'",
          },
          merchant_address: {
            type: "string",
            description: "Direct wallet address of a verified merchant (alternative to merchant_id)",
          },
          amount_usdt: {
            type: "string",
            description: "Amount in USD₮ to pay (e.g. '5.00', '10.50')",
          },
        },
        required: ["amount_usdt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "activate_internet",
      description:
        "Activate WiFi internet minutes from the agent's InternetVoucher balance. Emits an on-chain event that the router listens to.",
      parameters: {
        type: "object",
        properties: {
          minutes: {
            type: "number",
            description: "Number of minutes to activate",
          },
        },
        required: ["minutes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_market_prices",
      description:
        "Compare USD₮ rates: ArepaHub internal rate vs external market (Binance P2P). Returns spread % and whether arbitrage is profitable.",
      parameters: {
        type: "object",
        properties: {
          spread_threshold_pct: {
            type: "string",
            description: "Minimum spread % to consider profitable. Default: 3",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_hub_liquidity",
      description: "Check total USD₮ liquidity available in ArepaHub (merchant liquidity bridge).",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "execute_arbitrage",
      description:
        "Execute an arbitrage cycle: detect spread between ArepaHub internal rate and Binance P2P, execute trade, inject profits back into ArepaHub. Agent decides when and why to trade.",
      parameters: {
        type: "object",
        properties: {
          max_capital_usdt: {
            type: "string",
            description: "Maximum USD₮ to deploy. Default: 50",
          },
          spread_threshold_pct: {
            type: "string",
            description: "Minimum spread % before executing. Default: 3",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "inject_liquidity",
      description: "Inject USD₮ directly into ArepaHub to increase available merchant liquidity.",
      parameters: {
        type: "object",
        properties: {
          amount_usdt: {
            type: "string",
            description: "Amount of USD₮ to inject",
          },
        },
        required: ["amount_usdt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_with_payment",
      description:
        "Make an HTTP request. If the server returns HTTP 402 (x402 protocol), automatically pays the required USD₮ and retries.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to fetch (may return 402 requiring payment)",
          },
          max_auto_pay_usdt: {
            type: "number",
            description: "Maximum USD₮ to auto-pay. Default: 5",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_savings_info",
      description:
        "Check the agent's SavingsVault position: sUSDT shares, current USD₮ value, price per share (yield earned), and total vault size.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deposit_savings",
      description:
        "Deposit USD₮ into SavingsVault to earn yield. Receives sUSDT shares. Yield comes from ArepaHub arbitrage profits.",
      parameters: {
        type: "object",
        properties: {
          amount_usdt: {
            type: "string",
            description: "Amount of USD₮ to deposit into the vault",
          },
        },
        required: ["amount_usdt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "withdraw_savings",
      description: "Withdraw from SavingsVault by burning sUSDT shares, receiving USD₮ back.",
      parameters: {
        type: "object",
        properties: {
          shares: {
            type: "string",
            description: "Amount of sUSDT shares to burn and withdraw",
          },
        },
        required: ["shares"],
      },
    },
  },
];
