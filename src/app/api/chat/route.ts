import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import type { IChatParticipant, IChatConversation, IChatMessage } from 'src/types/chat';

// ----------------------------------------------------------------------

// Generate mock contacts
function generateMockContacts(): IChatParticipant[] {
  return Array.from({ length: 20 }, (_, index) => ({
    id: _mock.id(index),
    name: _mock.fullName(index),
    role: _mock.role(index),
    email: _mock.email(index),
    address: _mock.fullAddress(index),
    avatarUrl: _mock.image.avatar(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    status: (index % 3 === 0 ? 'online' : index % 3 === 1 ? 'away' : 'busy') as 'online' | 'away' | 'busy' | 'offline',
  }));
}

// Generate mock messages
function generateMockMessages(conversationId: string, count: number = 10, offset: number = 0): IChatMessage[] {
  return Array.from({ length: count }, (_, index) => {
    const globalIndex = offset * 1000 + index;
    return {
      id: `${conversationId}-msg-${globalIndex}`,
      body: _mock.sentence(globalIndex),
      senderId: index % 2 === 0 ? 'current-user-id' : _mock.id(globalIndex % 5),
      contentType: 'text',
      createdAt: _mock.time(globalIndex),
      attachments: index % 4 === 0
        ? [
            {
              name: `attachment-${globalIndex}.pdf`,
              size: 1024 * 1024 * (index + 1),
              type: 'application/pdf',
              path: `/attachments/${conversationId}/${globalIndex}`,
              preview: _mock.image.cover(globalIndex),
              createdAt: _mock.time(globalIndex),
              modifiedAt: _mock.time(globalIndex),
            },
          ]
        : [],
    };
  });
}

// Generate mock conversations
function generateMockConversations(): IChatConversation[] {
  const contacts = generateMockContacts();

  return Array.from({ length: 10 }, (_, index) => {
    const conversationId = _mock.id(index);
    const participants = [contacts[index], contacts[index + 1]].filter(Boolean);
    const messages = generateMockMessages(conversationId, 5 + (index % 5), index);

    return {
      id: conversationId,
      type: index % 2 === 0 ? 'one-to-one' : 'group',
      unreadCount: index % 3 === 0 ? index % 5 : 0,
      messages,
      participants,
    };
  });
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const conversationId = searchParams.get('conversationId');

    // Return contacts
    if (endpoint === 'contacts') {
      const contacts = generateMockContacts();
      return NextResponse.json({
        contacts,
      });
    }

    // Return specific conversation
    if (endpoint === 'conversation' && conversationId) {
      const conversations = generateMockConversations();
      const conversation = conversations.find((c) => c.id === conversationId);

      if (!conversation) {
        // Generate a new conversation if not found
        const contacts = generateMockContacts();
        const newConversation: IChatConversation = {
          id: conversationId,
          type: 'one-to-one',
          unreadCount: 0,
          messages: generateMockMessages(conversationId, 10, 999),
          participants: [contacts[0], contacts[1]],
        };
        return NextResponse.json({
          conversation: newConversation,
        });
      }

      return NextResponse.json({
        conversation,
      });
    }

    // Return all conversations (default)
    const conversations = generateMockConversations();
    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    console.error('Get chat data error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationData } = body;

    // In a real app, you would save the conversation to a database
    return NextResponse.json({
      success: true,
      conversation: conversationData,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, messageData } = body;

    // In a real app, you would save the message to a database
    return NextResponse.json({
      success: true,
      conversationId,
      message: messageData,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

