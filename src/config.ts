// config.ts - Configuration for Solana Copy Trading Bot
import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";

const PRIMARY_RPC = "https://mainnet.helius-rpc.com/?api-key=3a0141e2-0c3c-4bbc-81e8-5c6843fb3f2c";
const BACKUP_RPC = "https://magical-green-asphalt.solana-mainnet.quiknode.pro/88c77291d3556b5d445a2dcf09790a0978027621";

export const getConnection = (): Connection => {
    try {
        return new Connection(PRIMARY_RPC, { commitment: "confirmed" });
    } catch (error) {
        console.error("Primary RPC failed, switching to backup...");
        return new Connection(BACKUP_RPC, { commitment: "confirmed" });
    }
};

export const loadWallet = (filePath: string): Keypair => {
    try {
        const secretKey = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return Keypair.fromSecretKey(new Uint8Array(secretKey));
    } catch (error) {
        console.error("Error loading wallet file. Make sure the path is correct.", error);
        process.exit(1);
    }
};

