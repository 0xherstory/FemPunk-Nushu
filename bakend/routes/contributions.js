const express = require("express");
const router = express.Router();
const pool = require("../db");

// record user contributions to a canvas
router.post("/record", async (req, res) => {
  const { canvas_id, contributor, contributions } = req.body;
  try {
    await pool.query(
      "INSERT INTO contributions(canvas_id, contributor, contributions, created_ts, updated_ts) VALUES ($1,$2,$3,extract(epoch from now())*1000,extract(epoch from now())*1000)",
      [canvas_id, contributor, contributions]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// get contributions for a canvas
router.get("/:canvas_id", async (req, res) => {
    const { canvas_id } = req.params;
    try {
        // return a array of contributions for the canvas
        const result = await pool.query("SELECT * FROM contributions WHERE canvas_id=$1 AND is_deleted=0", [canvas_id]);
        res.json({ success: true, contributions: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }


});

module.exports = router;
