import type { NextRequest } from 'next/server';
import type { IPostItem } from 'src/types/blog';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';

// ----------------------------------------------------------------------

// Generate mock posts for search
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
      favoritePerson: [],
    };
  });
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const allPosts = generateMockPosts();

    // Simple search filter by title, description, tags, or content
    const results = query
      ? allPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
            post.content.toLowerCase().includes(query.toLowerCase())
        )
      : allPosts.slice(0, 10); // Return first 10 if no query

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error('Search posts error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

