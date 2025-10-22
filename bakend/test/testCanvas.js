import { ethers } from "ethers";
import dotenv from "dotenv";
import abi from "../backend/abi/FemCanvas.json" assert { type: "json" };

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CANVAS_CONTRACT_ADDRESS, abi, wallet);

async function main() {
  console.log("Testing FemCanvas contract...");

  const canvasId = 1;
  const timestamp = Math.floor(Date.now() / 1000);
  const metadataURI = "ipfs://QmExampleMetadata";
  const supply = 100;

  const tx = await contract.mintCanvas(canvasId, timestamp, metadataURI, supply);
  console.log("Tx sent:", tx.hash);

  await tx.wait();
  console.log("Transaction confirmed!");

  // 读取 canvas 信息（如果你的合约有 getter）
  // const info = await contract.getCanvasInfo(canvasId);
  // console.log("Canvas Info:", info);
}

main().catch(console.error);
