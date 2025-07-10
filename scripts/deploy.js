const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Contract = await hre.ethers.getContractFactory("CrowdFunding");

  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed at:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});


