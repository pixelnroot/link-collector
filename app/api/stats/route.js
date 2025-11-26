import { NextResponse } from 'next/server';
import { getStats, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database on first request
    await initDatabase();

    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
