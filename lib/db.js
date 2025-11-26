import { sql } from '@vercel/postgres';

// Initialize database table
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_category ON links(category)
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

// Get all links
export async function getAllLinks() {
  try {
    const { rows } = await sql`
      SELECT * FROM links
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
}

// Get links by category
export async function getLinksByCategory(category) {
  try {
    const { rows } = await sql`
      SELECT * FROM links
      WHERE category = ${category}
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching links by category:', error);
    throw error;
  }
}

// Get statistics
export async function getStats() {
  try {
    const totalLinksResult = await sql`SELECT COUNT(*) as count FROM links`;
    const totalCategoriesResult = await sql`SELECT COUNT(DISTINCT category) as count FROM links`;
    const categoryStatsResult = await sql`
      SELECT category, COUNT(*) as count
      FROM links
      GROUP BY category
      ORDER BY count DESC
    `;
    const recentLinksResult = await sql`
      SELECT * FROM links
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return {
      totalLinks: parseInt(totalLinksResult.rows[0].count),
      totalCategories: parseInt(totalCategoriesResult.rows[0].count),
      categoryStats: categoryStatsResult.rows,
      recentLinks: recentLinksResult.rows,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// Add a new link
export async function addLink(url, category) {
  try {
    const { rows } = await sql`
      INSERT INTO links (url, category)
      VALUES (${url}, ${category})
      RETURNING *
    `;
    return { success: true, link: rows[0] };
  } catch (error) {
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      return { success: false, error: 'This link already exists in the database!' };
    }
    console.error('Error adding link:', error);
    return { success: false, error: 'Failed to add link' };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const { rows } = await sql`
      SELECT DISTINCT category, COUNT(*) as count
      FROM links
      GROUP BY category
      ORDER BY category
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
