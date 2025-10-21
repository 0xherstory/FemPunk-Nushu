const express = require("express");
const router = express.Router();
const pool = require("../db");
const { wallet } = require("../utils/wallet");
const canvasAbi = require("../abis/IFemCanvas.json");
const canvasContract = new ethers.Contract(process.env.CANVAS_CONTRACT_ADDRESS, canvasAbi, wallet);

// get canvas by day_timestamp
router.get("/:day_timestamp", async (req, res) => {
  const { day_timestamp } = req.params;
  try {
    const result = await pool.query("SELECT * FROM canvases WHERE day_timestamp=$1 AND is_deleted=0", [day_timestamp]);
    res.json({ success: true, canvas: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// get canvas by canvas_id
router.get("/id/:canvas_id", async (req, res) => {
    const { canvas_id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM canvases WHERE canvas_id=$1 AND is_deleted=0", [canvas_id]);
      res.json({ success: true, canvas: result.rows[0] || null });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
});

// create a canvas at everyday 00:00 UTC+8 （2025-10-21T00:00:00+08:00  =》 1760976000000）
router.post("/create", async (req, res) => {
  const { day_timestamp, ipfs_uri, supply } = req.body;
  try {
    const canvasUUID = uuidv4();
    const canvasId = BigInt(keccak256(toHex(canvasUUID)));
    const tx = await canvasContract.mintCanvas(canvasId, day_timestamp, ipfs_uri, supply);
    await tx.wait();

    // insert into database
    await pool.query(
      "INSERT INTO canvases(canvas_id, day_timestamp, metadata_uri, total_raised_wei, finalized, created_ts, updated_ts) VALUES ($1,$2,$3,0,0,extract(epoch from now())*1000,extract(epoch from now())*1000)",
      [canvasId, day_timestamp, ipfs_uri]
    );

    res.json({ success: true, canvasId});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// mint ERC1155 NFT for a canvas
router.post("/mint", async (req, res) => {
    const { canvas_id, ipfs_uri, supply } = req.body;
    const canvas = await pool.query(
        "SELECT * FROM canvases WHERE canvas_id=$1", [canvas_id]
    );
    if (canvas.rows.length === 0) return res.status(404).json({ success: false, error: "Canvas not found" });
    try {
        // update metadata uri in database
        await pool.query(
        "UPDATE INTO canvases(metadata_uri, updated_ts) VALUES ($1,extract(epoch from now())*1000) WHERE canvas_id=$2",
        [ipfs_uri,canvas_id]
        );
        const tx = await canvasContract.mintCanvas(canvas_id, day_timestamp, ipfs_uri, supply);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    }catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
    
});

module.exports = router;
