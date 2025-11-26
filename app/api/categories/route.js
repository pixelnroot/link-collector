import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Fetch all unique categories
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('linkCollector');
    const collection = db.collection('links');

    // Get distinct categories
    const categories = await collection.distinct('category');

    return NextResponse.json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
