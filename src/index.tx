// CLI-Based Solana Copy Trading Bot with Wallet Monitoring
import { loadWallet, getConnection } from "./config";
import { sendTransaction, monitorTransactions } from "./transaction";
import * as readline from "readline";
import { PublicKey } from "@solana/web3.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const main = async () => {
    console.log("=== CLI Solana Copy Trading Bot ===");

    const walletPath = await askQuestion("Enter path to wallet keypair JSON: ");
    const keypair = loadWallet(walletPath);
    console.log("Wallet loaded: ", keypair.publicKey.toBase58());

    const observerWallet = await askQuestion("Enter wallet address to monitor: ");
    const recipientAddress = await askQuestion("Enter recipient wallet address: ");
    const amount = await askQuestion("Enter amount to send (in SOL): ");

    const recipientPubkey = new PublicKey(recipientAddress);
    const observerPubkey = new PublicKey(observerWallet);
    const lamports = parseFloat(amount) * 10 ** 9;

    const connection = getConnection();
    monitorTransactions(observerPubkey, connection);

    console.log(`Monitoring transactions for: ${observerPubkey.toBase58()}`);

    await sendTransaction(connection, keypair, recipientPubkey, lamports);
    rl.close();
};

main();
