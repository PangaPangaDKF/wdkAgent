/**
 * SavingsVault tools — yield-bearing USD₮ deposits.
 *
 * SavingsVault accepts USDT and mints sUSDT shares.
 * Yield comes from arbitrage profits injected into ArepaHub.
 * pricePerShare grows over time as profits accumulate.
 */

import { ethers } from "ethers";
import { getWallet } from "../blockchain/wallet.js";
import { CONTRACTS, USDT_DECIMALS } from "../blockchain/config.js";
import { ERC20_ABI, SAVINGS_VAULT_ABI } from "../blockchain/abis.js";

export interface SavingsInfo {
  address: string;
  sharesBalance: string;
  usdtValue: string;
  pricePerShare: string;
  totalVaultAssets: string;
}

export interface SavingsDepositResult {
  success: boolean;
  txHash?: string;
  sharesReceived?: string;
  error?: string;
}

export interface SavingsWithdrawResult {
  success: boolean;
  txHash?: string;
  usdtReceived?: string;
  error?: string;
}

export async function getSavingsInfo(): Promise<SavingsInfo> {
  const wallet = getWallet();
  const vault = new ethers.Contract(CONTRACTS.savingsVault, SAVINGS_VAULT_ABI, wallet);

  const [shares, pricePerShare, totalAssets] = await Promise.all([
    vault.balanceOf(wallet.address),
    vault.pricePerShare(),
    vault.totalAssets(),
  ]);

  const sharesNum = Number(ethers.formatUnits(shares, USDT_DECIMALS));
  const price = Number(ethers.formatUnits(pricePerShare, USDT_DECIMALS));
  const usdtValue = (sharesNum * price).toFixed(6);

  return {
    address: wallet.address,
    sharesBalance: ethers.formatUnits(shares, USDT_DECIMALS),
    usdtValue,
    pricePerShare: ethers.formatUnits(pricePerShare, USDT_DECIMALS),
    totalVaultAssets: ethers.formatUnits(totalAssets, USDT_DECIMALS),
  };
}

export async function depositSavings(amountUSDT: string): Promise<SavingsDepositResult> {
  const wallet = getWallet();
  const usdt = new ethers.Contract(CONTRACTS.mockUSDT, ERC20_ABI, wallet);
  const vault = new ethers.Contract(CONTRACTS.savingsVault, SAVINGS_VAULT_ABI, wallet);

  const amount = ethers.parseUnits(amountUSDT, USDT_DECIMALS);

  try {
    const approveTx = await usdt.approve(CONTRACTS.savingsVault, amount);
    await approveTx.wait();

    const depositTx = await vault.deposit(amount);
    const receipt = await depositTx.wait();

    const sharesAfter = await vault.balanceOf(wallet.address);

    return {
      success: true,
      txHash: receipt.hash,
      sharesReceived: ethers.formatUnits(sharesAfter, USDT_DECIMALS),
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function withdrawSavings(shares: string): Promise<SavingsWithdrawResult> {
  const wallet = getWallet();
  const vault = new ethers.Contract(CONTRACTS.savingsVault, SAVINGS_VAULT_ABI, wallet);

  const sharesAmount = ethers.parseUnits(shares, USDT_DECIMALS);

  try {
    const withdrawTx = await vault.withdraw(sharesAmount);
    const receipt = await withdrawTx.wait();

    return {
      success: true,
      txHash: receipt.hash,
      usdtReceived: shares,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
