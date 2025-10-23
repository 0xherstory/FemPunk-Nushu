/**
 * 测试创建 Canvas（数据库写入）
 */
const axios = require("axios");

async function testCreateCanvas() {
  try {
    // 目标接口（修改为你的后端地址）
    const API_URL = "http://localhost:3000/api/canvas/create";

    // 模拟请求数据
    const payload = {
      day_timestamp: 1760976000000, // 2025-10-21T00:00:00+08:00
      metadata_uri: "https://subjective-aquamarine-hippopotamus.myfilebase.com/ipfs/QmExampleMetaURI",
      supply: 100,
      creator: "0x84228976433481050297e5780D80c3141D0BEACf",
    };

    console.log("testCreateCanvas发送请求到:", API_URL);
    const res = await axios.post(API_URL, payload);

    console.log("响应结果:");
    console.log(res.data);
  } catch (err) {
    console.error("testCreateCanvas请求失败:", err.response?.data || err.message);
  }
}

testCreateCanvas();
