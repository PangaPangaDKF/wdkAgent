/**
 * WDK-compatible wallet creation tool.
 *
 * Uses BIP-44 derivation (m/44'/60'/0'/0/0) — the same path used by
 * Tether's Wallet Development Kit (WDK) for EVM-compatible wallets.
 * Compatible with MetaMask, Ledger, and all standard HD wallets.
 */

import { ethers } from "ethers";

export interface WalletCreationResult {
  address: string;
  mnemonic: string;
  derivationPath: string;
  note: string;
}

/**
 * Create a new WDK-compatible HD wallet.
 * Returns address, mnemonic, and BIP-44 derivation path.
 * IMPORTANT: The mnemonic must be stored securely — it controls all funds.
 */
export async function createWallet(): Promise<WalletCreationResult> {
  const wallet = ethers.Wallet.createRandom();
  const hdWallet = ethers.HDNodeWallet.fromPhrase(wallet.mnemonic!.phrase);

  return {
    address: hdWallet.address,
    mnemonic: wallet.mnemonic!.phrase,
    derivationPath: "m/44'/60'/0'/0/0",
    note: "Store the mnemonic securely. Use WDK_SEED in .env to load this wallet.",
  };
}
