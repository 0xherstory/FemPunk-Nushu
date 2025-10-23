import { NextRequest, NextResponse } from 'next/server';

// Mock redemption codes for development
// In production, this would be stored in a database
const MOCK_REDEMPTION_CODES = new Map([
  ['FEMFUNK01-2024-DEMO', { colorHex: '#FF6B9D', used: false, expiresAt: '2024-12-31' }],
  ['NUSHU001-BETA-TEST', { colorHex: '#7A2EFF', used: false, expiresAt: '2024-12-31' }],
  ['COLLAB01-MINT-FREE', { colorHex: '#1EE11F', used: false, expiresAt: '2024-12-31' }],
  ['ARTIST01-EARLY-ACC', { colorHex: '#FFD700', used: false, expiresAt: '2024-12-31' }],
  ['COMMUNITY-REWARD01', { colorHex: '#FF4757', used: false, expiresAt: '2024-12-31' }],
]);

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: '兑换码不能为空' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Validate code format
    const codePattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!codePattern.test(normalizedCode)) {
      return NextResponse.json(
        { valid: false, error: '兑换码格式不正确' },
        { status: 400 }
      );
    }

    // Check if code exists
    const codeData = MOCK_REDEMPTION_CODES.get(normalizedCode);
    if (!codeData) {
      return NextResponse.json(
        { valid: false, error: '兑换码不存在或已失效' },
        { status: 404 }
      );
    }

    // Check if code is already used
    if (codeData.used) {
      return NextResponse.json(
        { valid: false, error: '兑换码已被使用' },
        { status: 409 }
      );
    }

    // Check if code is expired
    const now = new Date();
    const expiresAt = new Date(codeData.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { valid: false, error: '兑换码已过期' },
        { status: 410 }
      );
    }

    // Mark code as used (in production, this would update the database)
    codeData.used = true;

    return NextResponse.json({
      valid: true,
      colorHex: codeData.colorHex,
    });

  } catch (error) {
    console.error('Redemption validation error:', error);
    return NextResponse.json(
      { valid: false, error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// GET endpoint to check code status without marking as used
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: '缺少兑换码参数' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const codeData = MOCK_REDEMPTION_CODES.get(normalizedCode);

    if (!codeData) {
      return NextResponse.json(
        { exists: false, error: '兑换码不存在' },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(codeData.expiresAt);
    const isExpired = now > expiresAt;

    return NextResponse.json({
      exists: true,
      used: codeData.used,
      expired: isExpired,
      colorHex: codeData.used ? null : codeData.colorHex,
      expiresAt: codeData.expiresAt,
    });

  } catch (error) {
    console.error('Redemption check error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}