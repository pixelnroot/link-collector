'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddLink() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    url: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Link added successfully!');
        setMessageType('success');
        setFormData({ url: '', category: '' });

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage(data.error || 'Failed to add link');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/add" className="active">Add Link</Link>
        <Link href="/view">View Links</Link>
      </nav>

      <h1>Add New Link</h1>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select a category</option>
            <option value="facebook">Facebook</option>
            <option value="x">X (Twitter)</option>
            <option value="website">Website</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Link'}
        </button>
      </form>
    </div>
  );
}
