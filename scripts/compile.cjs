const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Compile the contract
  await hre.run("compile");

  // Get the contract artifact
  const artifact = require("../artifacts/contracts/CryptoMixer.sol/CryptoMixer.json");

  // Create the contracts directory if it doesn't exist
  const contractsDir = path.join(__dirname, "../contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Write the artifact to a file
  fs.writeFileSync(
    path.join(contractsDir, "CryptoMixer.json"),
    JSON.stringify(artifact, null, 2)
  );

  console.log("Contract artifact generated successfully");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
