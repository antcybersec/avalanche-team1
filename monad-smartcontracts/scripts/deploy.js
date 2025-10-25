const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MONDividendDistributor to Monad Testnet...");

  // Get the contract factory
  const MONDividendDistributor = await ethers.getContractFactory("MONDividendDistributor");

  // Deploy the contract
  const dividendDistributor = await MONDividendDistributor.deploy(
    "Zero-Man Company Token", // Token name
    "ZMC" // Token symbol
  );

  await dividendDistributor.deployed();

  const contractAddress = dividendDistributor.address;
  const owner = await dividendDistributor.owner();

  console.log("✅ Contract deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Owner:", owner);
  console.log("Network: Monad Testnet");
  console.log("\n📋 Next steps:");
  console.log("1. Verify contract on Monad Explorer:");
  console.log(`   npx hardhat verify --network monadTestnet ${contractAddress} "Zero-Man Company Token" "ZMC"`);
  console.log("2. Get test MON from Monad faucet (if available)");
  console.log("3. Send MON to contract address to trigger dividend distribution");
  console.log("4. Token holders can call withdrawDividend() to claim their rewards");
  console.log("\n🚀 Monad Benefits:");
  console.log("- High throughput: ~10,000 TPS");
  console.log("- Low latency: 400ms block times");
  console.log("- Fast finality: 800ms");
  console.log("- Low gas fees");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
