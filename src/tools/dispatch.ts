/**
 * Shared tool dispatcher — used by all agent modes (Gemini, CLI).
 */

import { checkBalance } from "./checkBalance.js";
import { payMerchant, payMerchantById } from "./payMerchant.js";
import { activateInternet } from "./activateInternet.js";
import { fetchWithPayment } from "../x402/client.js";
import { getMarketPrices, getHubLiquidity, executeArbitrage, injectLiquidity } from "./arbitrage.js";
import { createWallet } from "./wdkWallet.js";
import { getSavingsInfo, depositSavings, withdrawSavings } from "./savings.js";

export async function processToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  try {
    switch (toolName) {
      case "check_balance": {
        const result = await checkBalance(toolInput.address as string | undefined);
        return JSON.stringify(result, null, 2);
      }

      case "pay_merchant": {
        const amount = toolInput.amount_usdt as string;
        let result;
        if (toolInput.merchant_id) {
          result = await payMerchantById(toolInput.merchant_id as string, amount);
        } else if (toolInput.merchant_address) {
          result = await payMerchant(toolInput.merchant_address as string, amount);
        } else {
          return JSON.stringify({ error: "Either merchant_id or merchant_address is required" });
        }
        return JSON.stringify(result, null, 2);
      }

      case "activate_internet": {
        const result = await activateInternet(toolInput.minutes as number);
        return JSON.stringify(result, null, 2);
      }

      case "get_market_prices": {
        const pct = toolInput.spread_threshold_pct;
        const result = await getMarketPrices(pct !== undefined ? parseFloat(pct as string) : undefined);
        return JSON.stringify(result, null, 2);
      }

      case "get_hub_liquidity": {
        const result = await getHubLiquidity();
        return JSON.stringify(result, null, 2);
      }

      case "execute_arbitrage": {
        const pct2 = toolInput.spread_threshold_pct;
        const result = await executeArbitrage(
          toolInput.max_capital_usdt as string | undefined,
          pct2 !== undefined ? parseFloat(pct2 as string) : undefined
        );
        return JSON.stringify(result, null, 2);
      }

      case "inject_liquidity": {
        const result = await injectLiquidity(toolInput.amount_usdt as string);
        return JSON.stringify(result, null, 2);
      }

      case "fetch_with_payment": {
        const result = await fetchWithPayment(toolInput.url as string, {
          maxAutoPayUSDT: (toolInput.max_auto_pay_usdt as number | undefined) ?? 5,
        });
        return JSON.stringify(result, null, 2);
      }

      case "create_wallet": {
        const result = await createWallet();
        return JSON.stringify(result, null, 2);
      }

      case "get_savings_info": {
        const result = await getSavingsInfo();
        return JSON.stringify(result, null, 2);
      }

      case "deposit_savings": {
        const result = await depositSavings(toolInput.amount_usdt as string);
        return JSON.stringify(result, null, 2);
      }

      case "withdraw_savings": {
        const result = await withdrawSavings(toolInput.shares as string);
        return JSON.stringify(result, null, 2);
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err) {
    return JSON.stringify({ error: (err as Error).message });
  }
}
