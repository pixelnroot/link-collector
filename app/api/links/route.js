import { NextResponse } from 'next/server';
import { getAllLinks, getLinksByCategory, addLink, getCategories, initDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    // Initialize database on first request
    await initDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const action = searchParams.get('action');

    if (action === 'categories') {
      const categories = await getCategories();
      return NextResponse.json({ categories });
    }

    if (category && category !== 'all') {
      const links = await getLinksByCategory(category);
      return NextResponse.json({ links });
    }

    const links = await getAllLinks();
    return NextResponse.json({ links });
  } catch (error) {
    console.error('Links GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Initialize database on first request
    await initDatabase();

    const body = await request.json();
    const { url, category } = body;

    // Validation
    if (!url || !category) {
      return NextResponse.json(
        { success: false, error: 'Both URL and category are required!' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid URL!' },
        { status: 400 }
      );
    }

    const result = await addLink(url, category);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Links POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add link' },
      { status: 500 }
    );
  }
}
