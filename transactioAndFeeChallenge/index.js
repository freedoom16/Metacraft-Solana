// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const transferSol = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Generate a new keypair for the sender
  const from = Keypair.generate();

  // Generate another Keypair for the recipient
  const to = Keypair.generate();

  // Airdrop 2 SOL to Sender wallet
  console.log("Airdropping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(from.publicKey),
    2 * LAMPORTS_PER_SOL
  );

  // Confirm the airdrop
  await connection.confirmTransaction(fromAirDropSignature);

  console.log("Airdrop completed for the Sender account");

  // Check the balance of the sender's wallet
  const senderBalance = await connection.getBalance(
    new PublicKey(from.publicKey)
  );
  console.log(`Sender Wallet Balance: ${senderBalance / LAMPORTS_PER_SOL} SOL`);

  // Transfer 50% of the balance to the recipient
  const transferAmount = senderBalance / 2;
  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: transferAmount * LAMPORTS_PER_SOL,
    })
  );

  // Sign and send the transaction
  var signature = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  console.log("Transfer Signature is", signature);

  // Check the updated balance of the sender's wallet
  const updatedSenderBalance = await connection.getBalance(
    new PublicKey(from.publicKey)
  );
  console.log(
    `Updated Sender Wallet Balance: ${
      updatedSenderBalance / LAMPORTS_PER_SOL
    } SOL`
  );
};

transferSol();
