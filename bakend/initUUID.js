// generateUUID16.js
import crypto from "crypto";

/**
 * 生成 16 位数字 UUID（安全随机）
 */
function generateNumericUUID16() {
  // 生成 8 个随机字节 → 16 位十进制数字大约范围
  const buf = crypto.randomBytes(8);
  const hex = buf.toString("hex");
  const bigIntValue = BigInt("0x" + hex);

  // 保证长度不超过 16 位
  // todo 不能是0开头
  const uuid16 = bigIntValue % 10n ** 16n;
  return uuid16.toString().padStart(16, "0"); // 补齐 16 位
}

// 测试生成 10 个 UUID
for (let i = 0; i < 10; i++) {
  console.log(generateNumericUUID16());
}
