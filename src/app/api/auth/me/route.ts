import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import { _userList } from 'src/_mock/_user';

// ----------------------------------------------------------------------

function decodeJWTToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = decodeJWTToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }

    // Get user data
    // First check if it's the demo user
    if (decoded.email === 'demo@minimals.cc') {
      const demoUser = {
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        email: 'demo@minimals.cc',
        displayName: 'Jaydon Frankie',
        photoURL: _mock.image.avatar(24),
        role: 'admin',
      };
      return NextResponse.json({
        user: {
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          photoURL: demoUser.photoURL,
          role: demoUser.role,
        },
      });
    }

    // Find user in mock list
    const user = _userList.find((u) => u.id === decoded.userId || u.email === decoded.email);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.name,
        photoURL: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

