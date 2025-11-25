import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_COLOR_OPTIONS, PRODUCT_GENDER_OPTIONS, PRODUCT_SIZE_OPTIONS } from 'src/_mock/_product';
import type { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

// Generate mock product details
function generateMockProduct(productId: string): IProductItem | null {
  // Generate a consistent product based on ID
  const index = parseInt(productId.slice(-1), 10) || 0;
  const price = _mock.number.price(index);
  const priceSale = index % 3 === 0 ? price * 0.8 : null;
  const colors = PRODUCT_COLOR_OPTIONS.slice(0, (index % 4) + 1);
  const sizes = PRODUCT_SIZE_OPTIONS.slice(0, (index % 5) + 3).map((s) => s.value);
  const gender = [PRODUCT_GENDER_OPTIONS[index % PRODUCT_GENDER_OPTIONS.length].value];
  const category = PRODUCT_CATEGORY_OPTIONS[index % PRODUCT_CATEGORY_OPTIONS.length];
  const tags = [category, gender[0], 'new', 'popular'].slice(0, index % 3 + 2);

  const totalRatings = Math.floor(Math.random() * 100) + 10;
  const totalReviews = Math.floor(totalRatings * 0.3);

  return {
    id: productId,
    sku: `SKU-${String(index + 1).padStart(4, '0')}`,
    name: _mock.productName(index),
    code: `PRD-${String(index + 1).padStart(4, '0')}`,
    price,
    taxes: price * 0.1,
    tags,
    sizes,
    publish: index % 5 === 0 ? 'draft' : 'published',
    gender,
    coverUrl: _mock.image.product(index),
    images: Array.from({ length: 5 }, (_, imgIndex) => _mock.image.product(index + imgIndex)),
    colors,
    quantity: Math.floor(Math.random() * 100) + 10,
    category,
    available: Math.floor(Math.random() * 50) + 5,
    totalSold: Math.floor(Math.random() * 200) + 10,
    description: _mock.description(index) + '\n\n' + _mock.sentence(index) + '\n\n' + _mock.sentence(index + 1),
    totalRatings,
    totalReviews,
    createdAt: _mock.time(index),
    inventoryType: index % 3 === 0 ? 'low stock' : index % 4 === 0 ? 'out of stock' : 'in stock',
    subDescription: _mock.sentence(index),
    priceSale,
    reviews: Array.from({ length: Math.min(totalReviews, 10) }, (_, reviewIndex) => ({
      id: _mock.id(index + reviewIndex + 100),
      name: _mock.fullName(index + reviewIndex),
      rating: Math.floor(Math.random() * 3) + 3,
      comment: _mock.sentence(index + reviewIndex) + ' ' + _mock.description(index + reviewIndex),
      helpful: Math.floor(Math.random() * 20),
      avatarUrl: _mock.image.avatar(index + reviewIndex),
      postedAt: _mock.time(index + reviewIndex),
      isPurchased: reviewIndex % 2 === 0,
      attachments: reviewIndex % 3 === 0 ? [_mock.image.cover(index + reviewIndex)] : undefined,
    })),
    newLabel: {
      content: 'NEW',
      enabled: index % 4 === 0,
    },
    saleLabel: {
      content: 'SALE',
      enabled: priceSale !== null,
    },
    ratings: [
      { name: '5', starCount: Math.floor(totalRatings * 0.6), reviewCount: Math.floor(totalReviews * 0.6) },
      { name: '4', starCount: Math.floor(totalRatings * 0.25), reviewCount: Math.floor(totalReviews * 0.25) },
      { name: '3', starCount: Math.floor(totalRatings * 0.1), reviewCount: Math.floor(totalReviews * 0.1) },
      { name: '2', starCount: Math.floor(totalRatings * 0.03), reviewCount: Math.floor(totalReviews * 0.03) },
      { name: '1', starCount: Math.floor(totalRatings * 0.02), reviewCount: Math.floor(totalReviews * 0.02) },
    ],
  };
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ message: 'productId is required' }, { status: 400 });
    }

    const product = generateMockProduct(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error('Get product details error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

