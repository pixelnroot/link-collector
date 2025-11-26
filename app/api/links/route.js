import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Fetch links (all or by category)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const client = await clientPromise;
    const db = client.db('linkCollector');
    const collection = db.collection('links');

    let query = {};
    if (category && category !== 'all') {
      query = { category };
    }

    const links = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      links,
      count: links.length
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST - Add a new link
export async function POST(request) {
  try {
    const body = await request.json();
    const { url, category } = body;

    if (!url || !category) {
      return NextResponse.json(
        { success: false, error: 'URL and category are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('linkCollector');
    const collection = db.collection('links');

    // Check if link already exists
    const existingLink = await collection.findOne({ url });

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'Link already exists' },
        { status: 409 }
      );
    }

    // Create unique index on url field if it doesn't exist
    await collection.createIndex({ url: 1 }, { unique: true });

    // Add new link
    const result = await collection.insertOne({
      url,
      category,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Link added successfully',
      linkId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding link:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Link already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add link' },
      { status: 500 }
    );
  }
}
