// transaction.ts - Handles transactions and WebSocket monitoring
import { Connection, PublicKey, SystemProgram, Transaction, Keypair } from "@solana/web3.js";

export const sendTransaction = async (
    connection: Connection,
    keypair: Keypair,
    recipientPubkey: PublicKey,
    lamports: number
) => {
    try {
        const blockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: recipientPubkey,
                lamports,
            })
        );

        transaction.recentBlockhash = blockhash.blockhash;
        transaction.feePayer = keypair.publicKey;
        transaction.sign(keypair);

        const [primarySignature, backupSignature] = await Promise.all([
            connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true }),
            new Connection("https://magical-green-asphalt.solana-mainnet.quiknode.pro/88c77291d3556b5d445a2dcf09790a0978027621").sendRawTransaction(transaction.serialize(), { skipPreflight: true })
        ]);

        console.log(`Primary RPC Transaction Sent: ${primarySignature}`);
        console.log(`Backup RPC Transaction Sent: ${backupSignature}`);

        await Promise.all([
            connection.confirmTransaction(primarySignature, "confirmed"),
            connection.confirmTransaction(backupSignature, "confirmed")
        ]);

        console.log("Transaction confirmed on both RPC endpoints");
    } catch (error) {
        console.error("Transaction failed", error);
    }
};

// WebSocket Monitoring for Real-Time Transaction Updates
export const monitorTransactions = (observerPubkey: PublicKey, connection: Connection) => {
    const ws = new WebSocket("wss://api.mainnet-beta.solana.com");
    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "logsSubscribe",
                params: [{}, { commitment: "confirmed" }]
            })
        );
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.params) {
            console.log("New transaction detected for wallet:", observerPubkey.toBase58(), data.params);
        }
    };
    ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
    };
};
