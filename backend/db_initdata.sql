
-- 先生成color的uuid，手动写入初始颜色数据sql中
-- 插入 10 个灰阶颜色
INSERT INTO colors (
    color_id,
    color_code,
    token_id,
    owner_id,
    price_wei,
    status,
    created_ts,
    updated_ts,
    is_deleted
) VALUES
    (2901679367952876, '#FFFFFF', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (1342079089309930, '#E5E5E5', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (9088662171658145, '#CCCCCC', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (7656395871870435, '#B2B2B2', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (8417776330751887, '#999999', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (1064344713925674, '#7F7F7F', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (0996980585393431, '#666666', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (5750188040977308, '#4C4C4C', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (2954185897270328, '#333333', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0),
    (4270721359686718, '#000000', NULL, NULL, 0, 1, EXTRACT(EPOCH FROM NOW()) * 1000, EXTRACT(EPOCH FROM NOW()) * 1000, 0);


-- 插入一条画布记录（示例数据）
INSERT INTO canvases (
  canvas_id,
  day_timestamp,
  metadata_uri,
  creator,
  price,
  total_contributions,
  total_raised_wei,
  finalized,
  tx_hash,
  status,
  created_ts,
  updated_ts,
  is_deleted
) VALUES (
  4122776673090589, 
  1761436800006,                          -- 当日零点时间戳（毫秒），示例为 2025-10-26 00:00:00+08:00
  'https://ipfs.filebase.io/ipfs/QmZ5DCAuWBtadbsdpUiWnXteduiSiGUzY6iwnfd7F49U5w', -- metadata 的 IPFS URI
  '0x1234567890abcdef1234567890abcdef12345678', -- 创建者地址（64 字符限制内）
  1800000000000000000,                    -- 价格（例如 1 ETH = 10^18 wei）
  100,                                     -- 总贡献量
  0,                    -- 总筹集金额（wei），例如 5 ETH
  0,                                      -- 是否结算完成：0 未结算
  NULL,                                   -- 上链交易 hash，可为 NULL，或如 '0x...'(长度 66)
  1,                                      -- 状态（业务自定义，默认 1）
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, -- 创建时间（毫秒）
  EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, -- 更新时间（毫秒）
  0                                       -- 逻辑删除：0 未删除
);
