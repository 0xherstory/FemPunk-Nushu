import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "../backend/abi/FemContribution.json" assert { type: "json" };

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRIBUTION_CONTRACT_ADDRESS, abi, wallet);

async function main() {
  console.log("Testing FemContribution contract...");

  const contributor = await wallet.getAddress();
  const amount = ethers.parseEther("0.01");
  const metadataURI = "ipfs://QmContributionMeta";

  const tx = await contract.recordContribution(contributor, amount, metadataURI);
  console.log("Tx sent:", tx.hash);

  await tx.wait();
  console.log("Contribution recorded!");
}

main().catch(console.error);
