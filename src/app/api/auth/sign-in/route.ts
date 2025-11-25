import { NextRequest, NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import { _userList } from 'src/_mock/_user';

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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Demo credentials
    const DEMO_EMAIL = 'demo@minimals.cc';
    const DEMO_PASSWORD = '@2Minimal';

    // Check if it's demo user
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoUser = {
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        email: 'demo@minimals.cc',
        displayName: 'Jaydon Frankie',
        photoURL: _mock.image.avatar(24),
        role: 'admin',
      };
      const accessToken = generateJWTToken(demoUser.id, demoUser.email, demoUser.role);

      return NextResponse.json({
        accessToken,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          photoURL: demoUser.photoURL,
          role: demoUser.role,
        },
      });
    }

    // Check in mock user list
    const user = _userList.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // For demo purposes, accept any password for mock users
    // In production, you should verify the password hash
    const accessToken = generateJWTToken(user.id, user.email, user.role);

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.name,
        photoURL: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

