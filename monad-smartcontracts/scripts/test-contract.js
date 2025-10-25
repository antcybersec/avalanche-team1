const { ethers } = require("hardhat");

async function main() {
  console.log("Testing MONDividendDistributor contract interaction...");

  // Get the contract factory
  const MONDividendDistributor = await ethers.getContractFactory("MONDividendDistributor");

  // Deploy the contract
  const dividendDistributor = await MONDividendDistributor.deploy(
    "Zero-Man Company Token",
    "ZMC"
  );

  await dividendDistributor.deployed();

  const [owner, user1, user2] = await ethers.getSigners();

  console.log("✅ Contract deployed at:", dividendDistributor.address);
  console.log("Owner:", owner.address);

  // Mint tokens to users
  console.log("\n📝 Minting tokens...");
  await dividendDistributor.mint(user1.address, ethers.utils.parseEther("1000"));
  await dividendDistributor.mint(user2.address, ethers.utils.parseEther("2000"));
  
  console.log("User1 balance:", ethers.utils.formatEther(await dividendDistributor.balanceOf(user1.address)), "ZMC");
  console.log("User2 balance:", ethers.utils.formatEther(await dividendDistributor.balanceOf(user2.address)), "ZMC");

  // Send MON to contract
  console.log("\n💰 Sending MON to contract...");
  const sendAmount = ethers.utils.parseEther("10");
  await user1.sendTransaction({
    to: dividendDistributor.address,
    value: sendAmount
  });

  console.log("Sent", ethers.utils.formatEther(sendAmount), "MON to contract");

  // Check dividends
  console.log("\n📊 Checking dividends...");
  const user1Dividend = await dividendDistributor.withdrawableDividendOf(user1.address);
  const user2Dividend = await dividendDistributor.withdrawableDividendOf(user2.address);

  console.log("User1 withdrawable dividend:", ethers.utils.formatEther(user1Dividend), "MON");
  console.log("User2 withdrawable dividend:", ethers.utils.formatEther(user2Dividend), "MON");

  // Withdraw dividends
  console.log("\n💸 Withdrawing dividends...");
  await dividendDistributor.connect(user1).withdrawDividend();
  await dividendDistributor.connect(user2).withdrawDividend();

  console.log("✅ Dividends withdrawn successfully!");
  console.log("\n🎉 Contract interaction test completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
