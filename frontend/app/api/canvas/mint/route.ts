import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { canvas_id } = body;
    
    console.log('Frontend API received mint request:', { canvas_id });
    
    if (!canvas_id) {
      return NextResponse.json(
        { error: 'Canvas ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/canvas/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        canvas_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      
      // 尝试解析错误信息
      try {
        const errorJson = JSON.parse(errorData);
        return NextResponse.json(
          { error: errorJson.error || 'Failed to mint canvas' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Failed to mint canvas' },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('Canvas mint successful:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error minting canvas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}