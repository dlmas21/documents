import { NextRequest, NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Simple JWT token generator (for demo purposes)
function generateJWTToken(userId: string, email: string, role: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, // 3 days
    iat: Math.floor(Date.now() / 1000),
  };

  // Simple base64 encoding (for demo - in production use proper JWT library)
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // In production, you should sign this with a secret key
  const signature = Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name and last name are required' },
        { status: 400 }
      );
    }

    // Generate a new user ID
    const userId = _mock.id(Date.now());
    const displayName = `${firstName} ${lastName}`;
    const role = 'user'; // Default role for new users

    const accessToken = generateJWTToken(userId, email, role);

    return NextResponse.json({
      accessToken,
      user: {
        id: userId,
        email,
        displayName,
        role,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

