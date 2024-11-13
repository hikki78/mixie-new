import { ethers } from "hardhat";
import Moralis from 'moralis';
import { MORALIS_API_KEY } from '../lib/config';

async function main() {
  // Start Moralis
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  console.log('Deploying CryptoMixer contract...');

  // Get the deployer
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // Deploy the contract
  const CryptoMixer = await ethers.getContractFactory("CryptoMixer");
  const mixer = await CryptoMixer.deploy();
  await mixer.deployed();

  console.log('CryptoMixer deployed to:', mixer.address);
  console.log('Network:', process.env.NEXT_PUBLIC_CHAIN_ID === '1' ? 'Mainnet' : 'Sepolia Testnet');

  // Wait for a few block confirmations
  console.log('Waiting for block confirmations...');
  await mixer.deployTransaction.wait(5);

  // Log deployment details to Moralis
  try {
    await Moralis.EvmApi.transaction.getTransaction({
      transactionHash: mixer.deployTransaction.hash,
      chain: process.env.NEXT_PUBLIC_CHAIN_ID === '1' ? '0x1' : '0xaa36a7',
    });

    console.log('Transaction logged to Moralis');
    console.log('Contract Address:', mixer.address);
    console.log('Transaction Hash:', mixer.deployTransaction.hash);
  } catch (error) {
    console.error('Error logging to Moralis:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });