'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <nav>
        <Link href="/" className="active">Home</Link>
        <Link href="/add">Add Link</Link>
        <Link href="/view">View Links</Link>
      </nav>

      <div className="hero">
        <h1>Link Collector</h1>
        <p>Organize and manage your links by category</p>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {error && (
        <div className="message error">
          Error: {error}
        </div>
      )}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.totalLinks}</h3>
              <p>Total Links</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalCategories}</h3>
              <p>Categories</p>
            </div>
          </div>

          {stats.categoryStats && stats.categoryStats.length > 0 && (
            <div className="category-stats">
              <h2>Links by Category</h2>
              <div className="category-grid">
                {stats.categoryStats.map((stat) => (
                  <Link
                    key={stat.category}
                    href={`/view?category=${encodeURIComponent(stat.category)}`}
                    className="category-card"
                  >
                    <h3>{stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}</h3>
                    <p>{stat.count} link{stat.count !== 1 ? 's' : ''}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {stats.recentLinks && stats.recentLinks.length > 0 ? (
            <div className="recent-links">
              <h2>Recent Links</h2>
              <ul className="links-list">
                {stats.recentLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.url}
                    </a>
                    <span className="category-badge">{link.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <h2>No links yet</h2>
              <p>Start by adding your first link!</p>
              <Link href="/add" className="btn-primary">Add Link</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
