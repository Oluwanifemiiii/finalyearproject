const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Contract = await hre.ethers.getContractFactory("CrowdFunding");
  const contract = await Contract.attach(contractAddress);

  const name = "Build the Web3 web";
  const description = "We're building a decentralized web3 web.";
  const goal = hre.ethers.parseEther("15");
  const durationInDays = 14;

  const tx = await contract.createCampaign(
    user.address,
    name,
    description,
    goal,
    durationInDays
  );

  const receipt = await tx.wait();
  const campaignId = await contract.numberOfCampaigns() - 1n;

  console.log(`✅ Campaign created with ID: ${campaignId}`);
}

main().catch(console.error);