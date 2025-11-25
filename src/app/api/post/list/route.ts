import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import { POST_PUBLISH_OPTIONS } from 'src/_mock/_blog';
import type { IPostItem } from 'src/types/blog';

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
      comments: Array.from({ length: Math.min(totalComments, 5) }, (_, commentIndex) => ({
        id: _mock.id(index + commentIndex + 100),
        name: _mock.fullName(index + commentIndex),
        message: _mock.sentence(index + commentIndex),
        avatarUrl: _mock.image.avatar(index + commentIndex),
        postedAt: _mock.time(index + commentIndex),
        users: Array.from({ length: 2 }, (_, userIndex) => ({
          id: _mock.id(index + commentIndex + userIndex + 200),
          name: _mock.fullName(index + commentIndex + userIndex),
          avatarUrl: _mock.image.avatar(index + commentIndex + userIndex),
        })),
        replyComment: commentIndex % 2 === 0
          ? [
              {
                id: _mock.id(index + commentIndex + 300),
                userId: _mock.id(index + commentIndex + 1),
                message: _mock.sentence(index + commentIndex + 10),
                tagUser: _mock.fullName(index + commentIndex + 1),
                postedAt: _mock.time(index + commentIndex + 1),
              },
            ]
          : [],
      })),
      author: {
        name: _mock.fullName(index),
        avatarUrl: _mock.image.avatar(index),
      },
      favoritePerson: Array.from({ length: Math.min(totalFavorites, 5) }, (_, favIndex) => ({
        name: _mock.fullName(index + favIndex),
        avatarUrl: _mock.image.avatar(index + favIndex),
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

