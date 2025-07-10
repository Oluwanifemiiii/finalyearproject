const hre = require("hardhat");
const { formatEther } = hre.ethers;
const fs = require("fs");

async function main() {
  const Contract = await hre.ethers.getContractFactory("CrowdFunding");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const contract = await Contract.attach(contractAddress);

  const campaigns = await contract.getCampaigns();
  const count = await contract.numberOfCampaigns();

  console.log(`\n📦 Total campaigns: ${count.toString()}\n`);

  campaigns.forEach((c, i) => {
    const deadline = new Date(
      Number(c.startTime) * 1000 + Number(c.durationInDays) * 24 * 60 * 60 * 1000
    );

    console.log(`📌 Campaign #${i}`);
    console.log(`- Owner:       ${c.owner}`);
    console.log(`- Name:        ${c.name}`);
    console.log(`- Description: ${c.description}`);
    console.log(`- Goal:        ${formatEther(c.goal)} ETH`);
    console.log(`- Raised:      ${formatEther(c.amountCollected)} ETH`);
    console.log(`- Duration:    ${c.durationInDays} days`);
    console.log(`- Deadline:    ${deadline.toISOString()}`);
    console.log("--------------------------------------------------");
  });

  fs.writeFileSync(
    "allCampaigns.json",
    JSON.stringify(campaigns, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2)
  );
}

main().catch(console.error);