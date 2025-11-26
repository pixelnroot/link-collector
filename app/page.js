'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, category }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Link added successfully!', type: 'success' });
        setUrl('');
        setCategory('');
      } else {
        setMessage({ text: data.error || 'Failed to add link', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Link Collector</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Save and organize your favorite links by category
        </p>

        <div className="nav">
          <Link href="/" className="btn">
            Add Link
          </Link>
          <Link href="/view" className="btn btn-secondary">
            View Links
          </Link>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Facebook">Facebook</option>
              <option value="Youtube">Youtube</option>
              <option value="Twitter">Twitter</option>
              <option value="Linkedin">Linkedin</option>
              <option value="Website">Website</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
