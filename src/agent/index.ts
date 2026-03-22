/**
 * WDK Agent — Tether Hackathon Track 1: Agent Wallets
 *
 * Autonomous agent powered by Google Gemini 2.0 Flash.
 * Manages USD₮ wallets, executes DeFi trades, and pays merchants
 * autonomously via the x402 protocol on ArepaPay L1.
 *
 * Usage:
 *   npm run dev
 *   Then type your request, e.g.:
 *   "crea una nueva wallet"
 *   "deposita 100 USDT en savings"
 *   "hay oportunidad de arbitraje?"
 */

import "dotenv/config";
import OpenAI from "openai";
import * as readline from "readline";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { AGENT_TOOLS } from "./tools.js";
import { processToolCall } from "../tools/dispatch.js";

const client = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-1.5-flash";

const SYSTEM_PROMPT = `You are WDK Agent, an autonomous Web3 financial agent for the ArepaPay ecosystem.
You are built on Tether's WDK (Wallet Development Kit) primitives and run on ArepaPay L1 (Avalanche subnet, Chain ID 13370).

You can autonomously:
- Create new WDK-compatible HD wallets (BIP-44 m/44'/60'/0'/0/0)
- Check USD₮ balances and manage funds
- Pay verified merchants via PaymentProcessor (earns +1 raffle ticket + 30 WiFi min)
- Deposit USD₮ into SavingsVault for yield (sUSDT)
- Execute arbitrage cycles when spread > 3% between ArepaHub and Binance P2P
- Fetch x402-gated HTTP resources and auto-pay when HTTP 402 is returned
- Activate WiFi internet vouchers on-chain

Key context:
- USD₮ uses 6 decimals (real USDT standard)
- ArepaHub: merchant liquidity bridge (internal USD₮ ↔ Bolivares)
- SavingsVault: yield-bearing vault — profits from arbitrage flow here
- x402 protocol: HTTP 402 → auto-pay on-chain → retry with payment proof
- All wallet operations use WDK-compatible BIP-44 derivation

Be concise and action-oriented. Always confirm tx hashes after on-chain operations.`;

async function runAgent(
  userMessage: string,
  history: ChatCompletionMessageParam[]
): Promise<ChatCompletionMessageParam[]> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  console.log("\n🤖 WDK Agent thinking...\n");

  while (true) {
    // Retry on 429 (Gemini free tier rate limit)
    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await client.chat.completions.create({
          model: MODEL,
          messages,
          tools: AGENT_TOOLS,
          tool_choice: "auto",
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if (status === 429 && attempt < 3) {
          const wait = attempt * 5;
          console.log(`⏳ Rate limit — reintentando en ${wait}s...`);
          await new Promise((r) => setTimeout(r, wait * 1000));
        } else {
          throw err;
        }
      }
    }
    if (!response) throw new Error("No response from Gemini after retries");

    const choice = response.choices[0];
    messages.push(choice.message);

    if (choice.finish_reason === "stop" || !choice.message.tool_calls?.length) {
      if (choice.message.content) {
        console.log(`\n💬 ${choice.message.content}\n`);
      }
      break;
    }

    if (choice.finish_reason === "tool_calls") {
      for (const tc of choice.message.tool_calls) {
        let input: Record<string, unknown>;
        try {
          input = JSON.parse(tc.function.arguments) as Record<string, unknown>;
        } catch {
          input = {};
        }

        console.log(`\n🔧 Tool: ${tc.function.name}`);
        console.log(`   Input: ${tc.function.arguments}`);

        const result = await processToolCall(tc.function.name, input);
        console.log(`   Result: ${result.slice(0, 200)}${result.length > 200 ? "..." : ""}`);

        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: result,
        });
      }
    }
  }

  return messages.slice(1); // exclude system prompt from history
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not set. Get it free at https://aistudio.google.com → Get API Key");
    process.exit(1);
  }

  console.log("┌──────────────────────────────────────────────┐");
  console.log("│  💳  WDK Agent — Tether Hackathon            │");
  console.log("│     Gemini 2.0 Flash | ArepaPay L1           │");
  console.log("└──────────────────────────────────────────────┘");
  console.log('\nType your request (e.g. "check my balance") or "exit" to quit.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let history: ChatCompletionMessageParam[] = [];
  let closed = false;

  rl.on("close", () => { closed = true; });

  const ask = () => {
    if (closed) return;
    rl.question("wdk> ", async (input) => {
      const trimmed = input.trim();
      if (!trimmed || trimmed.toLowerCase() === "exit") {
        console.log("Hasta luego! 💳");
        rl.close();
        return;
      }
      try {
        history = await runAgent(trimmed, history);
      } catch (err) {
        console.error(`\n❌ Error: ${(err as Error).message}\n`);
      }
      ask();
    });
  };

  ask();
}

main().catch(console.error);
