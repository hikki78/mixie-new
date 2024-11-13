import { ethers } from "hardhat";

async function main() {
  const CryptoMixer = await ethers.getContractFactory("CryptoMixer");
  const mixer = await CryptoMixer.deploy();
  await mixer.deployed();

  console.log(`CryptoMixer deployed to ${mixer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});