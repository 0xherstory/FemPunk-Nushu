const express = require("express");
const router = express.Router();
const pool = require("../db");
const { ethers } = require("ethers");
const { wallet } = require("../utils/wallet");
const canvasAbi = require("../abi/FemCanvas.json");
const revenueAbi = require("../abi/FemCanvasRevenue.json");
const { generateUUID } = require("../utils/generateUUID");
const { uploadToFilebase, uploadMetadata } = require('../utils/uploadNft');
const canvasContract = new ethers.Contract(process.env.CANVAS_CONTRACT_ADDRESS, canvasAbi, wallet);
const canvasRevenue = new ethers.Contract(process.env.REVENUE_CONTRACT_ADDRESS, revenueAbi, wallet);

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
  // metadata_uri is first version uri, later can be updated when minting
  const { day_timestamp, metadata_uri, supply, creator } = req.body;
  try {
    const canvasId = generateUUID();
    const creator = req.body.creator || "0x84228976433481050297e5780D80c3141D0BEACf";
    // insert into database
    await pool.query(
      "INSERT INTO canvases(canvas_id, day_timestamp, metadata_uri, creator,total_raised_wei, finalized, updated_ts,created_ts) VALUES ($1,$2,$3,$4,0,0,extract(epoch from now())*1000,extract(epoch from now())*1000)",
      [canvasId, day_timestamp, metadata_uri, creator]
    );

    res.json({ success: true, canvasId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// mint ERC1155 NFT for a canvas
router.post("/mint", async (req, res) => {
  // step1: update metadata_uri in database
  const { canvas_id } = req.body;
  console.log("Routers Minting canvas :", canvas_id);
  // step1: check canvas info
  const canvas = await pool.query(
    "SELECT * FROM canvases WHERE canvas_id=$1", [canvas_id]
  );
  if (canvas.rows.length === 0) return res.status(404).json({ success: false, error: "Canvas not found" });

  try {
    const metadata_uri = canvas.rows[0].metadata_uri
    const day_timestamp = canvas.rows[0].day_timestamp;
    const supply = 1;// default supply 1
    // step2: call contract to mint
    console.log("Calling mintCanvas on contract...");
    const tx = await canvasContract.mintCanvas(canvas_id, day_timestamp, metadata_uri, supply);
    await tx.wait();
    const txHash = tx.hash;
    console.log("Calling mintCanvas txHash is:", txHash);
    // step3: update tx_hash in database
    await pool.query(
      "UPDATE canvases SET tx_hash=$1, updated_ts=extract(epoch from now())*1000 WHERE canvas_id=$2;",
      [txHash, canvas_id]
    );

    res.json({ success: true, txHash: txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }

});

// mint + contribution + finalize in one step
router.post("/finalize", async (req, res) => {
  const { canvas_id } = req.body;
  try {
    // step1: check canvas info
    const canvas = await pool.query(
      "SELECT * FROM canvases WHERE canvas_id=$1", [canvas_id]
    );
    if (canvas.rows.length === 0) return res.status(404).json({ success: false, error: "Canvas not found" });
    const metadata_uri = canvas.rows[0].metadata_uri
    const day_timestamp = canvas.rows[0].day_timestamp;
    const supply = 100;// default supply 100
    const price = ethers.parseEther("0.0018");
    const totalRaised = price * BigInt(supply);
    console.log("Total raised wei:", totalRaised.toString());

    // step2: call contract to mint
    console.log("Calling mintCanvas on contract...");
    const mintTx = await canvasContract.mintCanvas(canvas_id, day_timestamp, metadata_uri, supply);
    await mintTx.wait();
    const mintTxHash = mintTx.hash;
    console.log("Calling mintCanvas txHash is:", mintTxHash);

    // step3: receive revenue
    const receiveRevenueTx = await canvasRevenue.receiveRevenue(canvas_id);
    await receiveRevenueTx.wait();
    const receiveRevenueTxHash = receiveRevenueTx.hash;
    console.log("Calling receiveRevenue txHash is:", receiveRevenueTxHash);

    // step4: revenue claim
    const revenueTx = await canvasRevenue.claimRevenue(canvas_id);
    await revenueTx.wait();
    const revenueTxHash = revenueTx.hash;
    console.log("Calling claimRevenue txHash is:", revenueTxHash);

    // step3: update database
    await pool.query(
      "UPDATE canvases SET total_raised_wei=$1, updated_ts=extract(epoch from now())*1000 WHERE canvas_id=$2;",
      [totalRaised, canvas_id]
    );
    await pool.query(
      "UPDATE settlements SET total_income_wei=$2,updated_ts=extract(epoch from now())*1000 WHERE canvas_id=$1;",
      [canvas_id, totalRaised]
    );


    res.json({ success: true, mintTxHash, receiveRevenueTxHash, revenueTxHash });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
