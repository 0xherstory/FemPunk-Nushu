const express = require("express");
const router = express.Router();
const pool = require("../db");
const { wallet } = require("../utils/wallet");
const colorsAbi = require("../abis/IFemColors.json");
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

    const price = color.rows[0].price_wei;
    const tx = await colorsContract.buyCodlor(color_id, { value: price });
    await tx.wait();

    await pool.query("UPDATE colors SET owner_address=$1, updated_ts=extract(epoch from now())*1000 WHERE color_id=$2", [address, color_id]);
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// reword colors to users
router.post("/reward", async (req, res) => {
    const {address,color_id,metadata_uri} = req.body;
    try {
      const color = await pool.query("SELECT * FROM colors WHERE color_id=$1", [color_id]);
      if (color.rows.length === 0) return res.status(404).json({ success: false, error: "Color not found" });
  
      const rewardAmount = color.rows[0].reward_wei;
      const tx = await colorsContract.rewardColor(address,color_id, metadata_uri);
      await tx.wait();
    }catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
