import type { NextRequest } from 'next/server';
import type { IPostItem } from 'src/types/blog';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Generate mock post details
function generateMockPost(title: string): IPostItem | null {
  // Generate a consistent post based on title (kebabCase)
  // Use a simple hash of the title to get a consistent index
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = ((hash * 31) + char) % 2147483647; // Simple hash without bitwise operations
  }
  const index = Math.abs(hash) % 20; // Use modulo to get index 0-19
  const postTitle = _mock.postTitle(index);
  const tags = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'].slice(0, (index % 3) + 2);
  const publish = index % 5 === 0 ? 'draft' : 'published';
  const totalViews = Math.floor(Math.random() * 10000) + 100;
  const totalComments = Math.floor(Math.random() * 50) + 5;
  const totalFavorites = Math.floor(Math.random() * 200) + 10;
  const totalShares = Math.floor(Math.random() * 100) + 5;

  return {
    id: _mock.id(index),
    title: postTitle,
    tags,
    publish,
    content: `<h1>${postTitle}</h1><p>${_mock.description(index)}</p><p>${_mock.sentence(index)}</p><p>${_mock.sentence(index + 1)}</p><h2>Section 1</h2><p>${_mock.description(index + 1)}</p><h2>Section 2</h2><p>${_mock.sentence(index + 2)}</p><p>${_mock.description(index + 2)}</p>`,
    coverUrl: _mock.image.cover(index),
    metaTitle: `${postTitle} - Blog Post`,
    totalViews,
    totalShares,
    description: _mock.description(index) + ' ' + _mock.sentence(index),
    totalComments,
    createdAt: _mock.time(index),
    totalFavorites,
    metaKeywords: tags,
    metaDescription: _mock.sentence(index) + ' ' + _mock.description(index),
    comments: Array.from({ length: Math.min(totalComments, 10) }, (_, commentIdx) => ({
      id: _mock.id(index + commentIdx + 100),
      name: _mock.fullName(index + commentIdx),
      message: _mock.sentence(index + commentIdx) + ' ' + _mock.description(index + commentIdx),
      avatarUrl: _mock.image.avatar(index + commentIdx),
      postedAt: _mock.time(index + commentIdx),
      users: Array.from({ length: 2 }, (__, userIdx) => ({
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
    favoritePerson: Array.from({ length: Math.min(totalFavorites, 10) }, (__, favIdx) => ({
      name: _mock.fullName(index + favIdx),
      avatarUrl: _mock.image.avatar(index + favIdx),
    })),
  };
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title) {
      return NextResponse.json({ message: 'title is required' }, { status: 400 });
    }

    const post = generateMockPost(title);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      post,
    });
  } catch (error) {
    console.error('Get post details error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

