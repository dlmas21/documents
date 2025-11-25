import type { NextRequest } from 'next/server';
import type { IPostItem } from 'src/types/blog';

import { kebabCase } from 'es-toolkit';
import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Generate mock latest posts
function generateMockLatestPosts(excludeTitle?: string): IPostItem[] {
  return Array.from({ length: 5 }, (_, index) => {
    const id = _mock.id(index);
    const title = _mock.postTitle(index);
    const tags = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'].slice(0, (index % 3) + 2);
    const publish = 'published';
    const totalViews = Math.floor(Math.random() * 10000) + 100;
    const totalComments = Math.floor(Math.random() * 50) + 5;
    const totalFavorites = Math.floor(Math.random() * 200) + 10;
    const totalShares = Math.floor(Math.random() * 100) + 5;

    return {
      id,
      title,
      tags,
      publish,
      content: `<h1>${title}</h1><p>${_mock.description(index)}</p>`,
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
      comments: [],
      author: {
        name: _mock.fullName(index),
        avatarUrl: _mock.image.avatar(index),
      },
      favoritePerson: Array.from({ length: Math.min(totalFavorites, 3) }, (__, favIdx) => ({
        name: _mock.fullName(index + favIdx),
        avatarUrl: _mock.image.avatar(index + favIdx),
      })),
    };
  }).filter((post) => !excludeTitle || kebabCase(post.title) !== excludeTitle);
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeTitle = searchParams.get('excludeTitle');

    const latestPosts = generateMockLatestPosts(excludeTitle || undefined);

    return NextResponse.json({
      latestPosts,
    });
  } catch (error) {
    console.error('Get latest posts error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

