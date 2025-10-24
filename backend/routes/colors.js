const express = require("express");
const router = express.Router();
const pool = require("../db");
const { ethers } = require("ethers");
const { wallet } = require("../utils/wallet");
const colorsAbi = require("../abi/FemColors.json");
const colorsContract = new ethers.Contract(process.env.COLORS_CONTRACT_ADDRESS, colorsAbi, wallet);

// get total colors
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colors WHERE is_deleted=0");
    res.json({ success: true, colors: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// users buy colors
router.post("/buy", async (req, res) => {
  const { address, color_id } = req.body;
  try {
    const color = await pool.query("SELECT * FROM colors WHERE color_id=$1", [color_id]);
    if (color.rows.length === 0) return res.status(404).json({ success: false, error: "Color not found" });

    const metadataURI = color.rows[0].metadata_uri;
    // step1: update db
    await pool.query("UPDATE colors SET owner_address=$1,updated_ts=extract(epoch from now())*1000 WHERE color_id=$2", [address, color_id]);
    // step2: call contract
    const tx = await colorsContract.buyCodlor(color_id, { value: metadataURI });
    await tx.wait();
    // step3: update db with tx hash
    await pool.query("UPDATE colors SET owner_address=$1, updated_ts=extract(epoch from now())*1000 WHERE color_id=$2", [address, color_id]);

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// reword colors to users
router.post("/reward", async (req, res) => {
    const {address,color_id} = req.body;
    try {
      const color = await pool.query("SELECT * FROM colors WHERE color_id=$1", [color_id]);
      if (color.rows.length === 0) return res.status(404).json({ success: false, error: "Color not found" });
      const metadataURI = color.rows[0].metadata_uri;
      // step1: update db
      await pool.query("UPDATE colors SET owner_address=$1,updated_ts=extract(epoch from now())*1000 WHERE color_id=$2", [address, color_id]);
      // sep2: call contract
      const tx = await colorsContract.rewardColor(address,color_id, { value: metadataURI });
      await tx.wait();
      const txHash = tx.hash;
      console.log("Tx sent:", txHash);
      // sep3: update tx_hash in db
      await pool.query("UPDATE colors SET tx_hash=$3, updated_ts=extract(epoch from now())*1000 WHERE color_id=$1", [color_id,txHash]);


      res.json({ success: true, txHash: txHash });
    }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
