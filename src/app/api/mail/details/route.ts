import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import type { IMail } from 'src/types/mail';

// ----------------------------------------------------------------------

// Generate mock mail details
function generateMockMail(mailId: string): IMail | null {
  // Generate a consistent mail based on ID
  const index = parseInt(mailId.slice(-1), 10) || 0;
  const isUnread = index % 3 === 0;
  const isStarred = index % 4 === 0;
  const isImportant = index % 5 === 0;
  const folder = index % 2 === 0 ? 'inbox' : 'sent';

  return {
    id: mailId,
    folder,
    subject: `Email Subject ${index + 1} - ${_mock.sentence(index)}`,
    message: `This is a detailed email message for email ${index + 1}.\n\n${_mock.description(index)}\n\n${_mock.sentence(index + 1)}\n\n${_mock.sentence(index + 2)}`,
    isUnread,
    from: {
      name: _mock.fullName(index),
      email: _mock.email(index),
      avatarUrl: _mock.image.avatar(index),
    },
    to: [
      {
        name: _mock.fullName(index + 10),
        email: _mock.email(index + 10),
        avatarUrl: _mock.image.avatar(index + 10),
      },
      ...(index % 2 === 0
        ? [
            {
              name: _mock.fullName(index + 20),
              email: _mock.email(index + 20),
              avatarUrl: _mock.image.avatar(index + 20),
            },
          ]
        : []),
    ],
    labelIds: [folder, ...(isImportant ? ['important'] : [])],
    isStarred,
    isImportant,
    createdAt: _mock.time(index),
    attachments: index % 3 === 0
      ? [
          {
            id: _mock.id(index + 100),
            name: `document-${index + 1}.pdf`,
            size: 1024 * 1024 * (index + 1),
            type: 'application/pdf',
            path: `/attachments/${mailId}`,
            preview: _mock.image.cover(index),
            createdAt: _mock.time(index),
            modifiedAt: _mock.time(index),
          },
          ...(index % 2 === 0
            ? [
                {
                  id: _mock.id(index + 101),
                  name: `image-${index + 1}.jpg`,
                  size: 512 * 1024 * (index + 1),
                  type: 'image/jpeg',
                  path: `/attachments/${mailId}-image`,
                  preview: _mock.image.cover(index + 1),
                  createdAt: _mock.time(index),
                  modifiedAt: _mock.time(index),
                },
              ]
            : []),
        ]
      : [],
  };
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mailId = searchParams.get('mailId');

    if (!mailId) {
      return NextResponse.json({ message: 'mailId is required' }, { status: 400 });
    }

    const mail = generateMockMail(mailId);

    if (!mail) {
      return NextResponse.json({ message: 'Mail not found' }, { status: 404 });
    }

    return NextResponse.json({
      mail,
    });
  } catch (error) {
    console.error('Get mail details error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

