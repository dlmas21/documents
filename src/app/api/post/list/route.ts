import type { NextRequest } from 'next/server';
import type { IPostItem } from 'src/types/blog';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Generate mock posts
function generateMockPosts(): IPostItem[] {
  return Array.from({ length: 20 }, (_, index) => {
    const id = _mock.id(index);
    const title = _mock.postTitle(index);
    const tags = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'].slice(0, (index % 3) + 2);
    const publish = index % 5 === 0 ? 'draft' : 'published';
    const totalViews = Math.floor(Math.random() * 10000) + 100;
    const totalComments = Math.floor(Math.random() * 50) + 5;
    const totalFavorites = Math.floor(Math.random() * 200) + 10;
    const totalShares = Math.floor(Math.random() * 100) + 5;

    return {
      id,
      title,
      tags,
      publish,
      content: `<h1>${title}</h1><p>${_mock.description(index)}</p><p>${_mock.sentence(index)}</p><p>${_mock.sentence(index + 1)}</p>`,
      coverUrl: _mock.image.cover(index),
      metaTitle: `${title} - Blog Post`,
      totalViews,
      totalShares,
      description: _mock.description(index),
      totalComments,
      createdAt: _mock.time(index),
      totalFavorites,
      metaKeywords: tags,
      metaDescription: _mock.sentence(index),
      comments: Array.from({ length: Math.min(totalComments, 5) }, (__, commentIdx) => ({
        id: _mock.id(index + commentIdx + 100),
        name: _mock.fullName(index + commentIdx),
        message: _mock.sentence(index + commentIdx),
        avatarUrl: _mock.image.avatar(index + commentIdx),
        postedAt: _mock.time(index + commentIdx),
        users: Array.from({ length: 2 }, (___, userIdx) => ({
          id: _mock.id(index + commentIdx + userIdx + 200),
          name: _mock.fullName(index + commentIdx + userIdx),
          avatarUrl: _mock.image.avatar(index + commentIdx + userIdx),
        })),
        replyComment: commentIdx % 2 === 0
          ? [
              {
                id: _mock.id(index + commentIdx + 300),
                userId: _mock.id(index + commentIdx + 1),
                message: _mock.sentence(index + commentIdx + 10),
                tagUser: _mock.fullName(index + commentIdx + 1),
                postedAt: _mock.time(index + commentIdx + 1),
              },
            ]
          : [],
      })),
      author: {
        name: _mock.fullName(index),
        avatarUrl: _mock.image.avatar(index),
      },
      favoritePerson: Array.from({ length: Math.min(totalFavorites, 5) }, (__, favIdx) => ({
        name: _mock.fullName(index + favIdx),
        avatarUrl: _mock.image.avatar(index + favIdx),
      })),
    };
  });
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const posts = generateMockPosts();

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error('Get post list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

