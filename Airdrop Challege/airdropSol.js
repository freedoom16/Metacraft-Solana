const { Connection, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const yargs = require("yargs");

async function airDropSol(accountAddress) {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const publicKey = new PublicKey(accountAddress);

  try {
    const fromAirDropSignature = await connection.requestAirdrop(
      publicKey,
      2 * LAMPORTS_PER_SOL
    );

    // Wait for the airdrop confirmation
    await connection.confirmTransaction(fromAirDropSignature);

    console.log("Airdrop successful!");
  } catch (error) {
    console.error("Airdrop failed:", error);
  }
}

// Command-line arguments setup using yargs
const argv = yargs
  .option("account", {
    alias: "a",
    description: "Account address to receive the airdrop",
    demandOption: true,
  })
  .help()
  .alias("help", "h").argv;

async function mainFunction() {
  const accountAddress = argv.account;

  try {
    await airDropSol(accountAddress);
  } catch (error) {
    console.error("Error:", error);
  }
}

mainFunction();
