const { ethers } = require("ethers");
const { Client } = require("pg");
const fs = require("fs");
const { log } = require("console");
require('dotenv').config();
const pool = require("../db/index.js");
const { wallet } = require("../utils/wallet"); 



// === 区块链配置 ===
const CONTRACT_ADDRESS = process.env.COLORS_CONTRACT_ADDRESS;
const ABI_PATH = "/Users/zhongyang/FemPunk-Nushu/bakend/abi/IFemColors.json";
const abi = JSON.parse(fs.readFileSync(ABI_PATH));
const colorsContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);


// === 测试 mintColor 并更新数据库 ===
async function mintColorTest() {
    try {
        console.log("testing rewardColor...");        
        const userAddress = "0x84228976433481050297e5780D80c3141D0BEACf"; // 测试用户地址
        const color_id = 1342079089309930; 
        const metadataURI = "https://subjective-aquamarine-hippopotamus.myfilebase.com/ipfs/QmTSAvujXNv6BeCjomKC4UwZHiEyxF8ztckkRof2143YHR";

        // 先更新数据库，再调用合约
        const tokenId = 0;
        await pool.query("UPDATE colors SET owner_address=$1,token_id=$3,updated_ts=extract(epoch from now())*1000 WHERE color_id=$2", [userAddress, color_id,tokenId]);
        // 调用 rewardColor
        console.log("testing colorsContract reward color...");       
        const tx = await colorsContract.rewardColor(userAddress, color_id, metadataURI);
        const txHash = tx.hash;
        console.log("Transaction sent:", txHash);
        await pool.query("UPDATE colors SET tx_hash=$2,updated_ts=extract(epoch from now())*1000 WHERE color_id=$1", [color_id,txHash]);

        const receipt = await tx.wait();

        await pool.query("UPDATE colors SET token_id=$2c'l updated_ts=extract(epoch from now())*1000 WHERE color_id=$1", [color_id,tokenId]);


    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

mintColorTest();
