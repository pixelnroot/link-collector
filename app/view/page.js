'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = ['Facebook', 'Youtube', 'Twitter', 'Linkedin', 'Website', 'Others'];

export default function ViewLinks() {
  const [links, setLinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async (category = 'all') => {
    setLoading(true);
    try {
      const url =
        category === 'all'
          ? '/api/links'
          : `/api/links?category=${encodeURIComponent(category)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchLinks(category);
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage({ text: 'Link copied to clipboard!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to copy link', type: 'error' });
    }
  };

  const copyAllLinks = async () => {
    try {
      const allUrls = links.map((link) => link.url).join('\n');
      await navigator.clipboard.writeText(allUrls);
      setMessage({
        text: `Copied ${links.length} link(s) to clipboard!`,
        type: 'success',
      });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to copy links', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1>View Links</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Browse and copy your saved links
        </p>

        <div className="nav">
          <Link href="/" className="btn btn-secondary">
            Add Link
          </Link>
          <Link href="/view" className="btn">
            View Links
          </Link>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="stats">
          <div className="stat-item">
            <div className="stat-value">{links.length}</div>
            <div className="stat-label">
              {selectedCategory === 'all' ? 'Total Links' : 'Filtered Links'}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{CATEGORIES.length}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>

        <div className="filter-section">
          <div className="form-group">
            <label htmlFor="category">Filter by Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-success btn-small"
            onClick={copyAllLinks}
            disabled={links.length === 0}
          >
            Copy All Links
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p>Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>
              {selectedCategory === 'all'
                ? 'No links saved yet. Add your first link!'
                : `No links found in "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="link-list">
            {links.map((link) => (
              <div key={link._id} className="link-item">
                <div className="link-info">
                  <div className="link-url">{link.url}</div>
                  <span className="link-category">{link.category}</span>
                  <div className="link-date">
                    Added: {formatDate(link.createdAt)}
                  </div>
                </div>
                <button
                  className="btn btn-small"
                  onClick={() => copyLink(link.url)}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
