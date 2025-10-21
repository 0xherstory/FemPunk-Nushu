const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const colorsRouter = require("./routes/colors");
const canvasRouter = require("./routes/canvas");
const contributionsRouter = require("./routes/contributions");
const revenueRouter = require("./routes/revenue");
const usersRouter = require("./routes/users");

const app = express();
app.use(bodyParser.json());

// API 路由
app.use("/api/colors", colorsRouter);
app.use("/api/canvas", canvasRouter);
app.use("/api/contributions", contributionsRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
