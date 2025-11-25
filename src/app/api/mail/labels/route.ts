import type { NextRequest } from 'next/server';
import type { IMailLabel } from 'src/types/mail';

import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------

// Mock mail labels
const mockLabels: IMailLabel[] = [
  { id: 'inbox', type: 'system', name: 'Inbox', color: '#1890FF', unreadCount: 3 },
  { id: 'sent', type: 'system', name: 'Sent', color: '#52C41A', unreadCount: 0 },
  { id: 'drafts', type: 'system', name: 'Drafts', color: '#FAAD14', unreadCount: 1 },
  { id: 'trash', type: 'system', name: 'Trash', color: '#FF4D4F', unreadCount: 0 },
  { id: 'spam', type: 'system', name: 'Spam', color: '#722ED1', unreadCount: 0 },
  { id: 'important', type: 'label', name: 'Important', color: '#F5222D', unreadCount: 2 },
  { id: 'work', type: 'label', name: 'Work', color: '#1890FF', unreadCount: 1 },
  { id: 'personal', type: 'label', name: 'Personal', color: '#52C41A', unreadCount: 0 },
];

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      labels: mockLabels,
    });
  } catch (error) {
    console.error('Get mail labels error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

