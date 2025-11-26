'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ViewLinks() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(categoryParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [filter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/links?action=categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const url = filter === 'all'
        ? '/api/links'
        : `/api/links?category=${encodeURIComponent(filter)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data.links || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const copyLinks = (category) => {
    const linksToCategory = links.filter(link =>
      category === 'all' || link.category === category
    );
    const urls = linksToCategory.map(link => link.url).join('\n');

    navigator.clipboard.writeText(urls).then(() => {
      const btn = document.querySelector(`[data-category="${category}"]`);
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const groupLinksByCategory = () => {
    const grouped = {};
    links.forEach(link => {
      if (!grouped[link.category]) {
        grouped[link.category] = [];
      }
      grouped[link.category].push(link);
    });
    return grouped;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const linksByCategory = filter === 'all' ? groupLinksByCategory() : null;

  return (
    <div className="container">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/add">Add Link</Link>
        <Link href="/view" className="active">View Links</Link>
      </nav>

      <h1>View Links</h1>

      <div className="filter-section">
        <form>
          <label htmlFor="category">Filter by Category:</label>
          <select
            id="category"
            name="category"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
              </option>
            ))}
          </select>
        </form>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {error && (
        <div className="message error">
          Error: {error}
        </div>
      )}

      {!loading && links.length === 0 && (
        <p className="no-links">
          No links found. <Link href="/add">Add your first link!</Link>
        </p>
      )}

      {!loading && links.length > 0 && (
        <>
          <div className="stats">
            <p>Total links: <strong>{links.length}</strong></p>
          </div>

          {filter === 'all' ? (
            // Show links grouped by category
            Object.entries(linksByCategory).map(([category, categoryLinks]) => (
              <div key={category} className="category-section">
                <h2>
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryLinks.length})
                </h2>
                <button
                  className="copy-btn"
                  data-category={category}
                  onClick={() => copyLinks(category)}
                >
                  Copy All {category.charAt(0).toUpperCase() + category.slice(1)} Links
                </button>
                <ul className="links-list">
                  {categoryLinks.map((link) => (
                    <li key={link.id}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Show filtered links
            <div className="category-section">
              <h2>
                {filter.charAt(0).toUpperCase() + filter.slice(1)} ({links.length})
              </h2>
              <button
                className="copy-btn"
                data-category={filter}
                onClick={() => copyLinks(filter)}
              >
                Copy All Links
              </button>
              <ul className="links-list">
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.url}
                    </a>
                    <span className="date">{formatDate(link.created_at)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
