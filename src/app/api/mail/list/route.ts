import type { NextRequest } from 'next/server';
import type { IMail } from 'src/types/mail';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Generate mock mails
function generateMockMails(labelId: string): IMail[] {
  const count = labelId === 'inbox' ? 15 : labelId === 'sent' ? 10 : labelId === 'drafts' ? 5 : 3;

  return Array.from({ length: count }, (_, index) => {
    const id = _mock.id(index);
    const isUnread = index % 3 === 0;
    const isStarred = index % 4 === 0;
    const isImportant = index % 5 === 0;

    return {
      id,
      folder: labelId,
      subject: `Email Subject ${index + 1} - ${_mock.sentence(index)}`,
      message: `This is the email message content for email ${index + 1}. ${_mock.description(index)}`,
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
      ],
      labelIds: [labelId, ...(isImportant ? ['important'] : [])],
      isStarred,
      isImportant,
      createdAt: _mock.time(index),
      attachments: index % 3 === 0
        ? [
            {
              id: _mock.id(index + 100),
              name: `attachment-${index + 1}.pdf`,
              size: 1024 * 1024 * (index + 1),
              type: 'application/pdf',
              path: `/attachments/${id}`,
              preview: _mock.image.cover(index),
              createdAt: _mock.time(index),
              modifiedAt: _mock.time(index),
            },
          ]
        : [],
    };
  });
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get('labelId') || 'inbox';

    const mails = generateMockMails(labelId);

    return NextResponse.json({
      mails,
    });
  } catch (error) {
    console.error('Get mail list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

