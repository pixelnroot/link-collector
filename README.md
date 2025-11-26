# Link Collector

A modern Next.js web application to collect, organize, and manage links by category using Vercel Postgres database. Deployable on Vercel with GitHub integration.

## Features

- Add unique links with categories (Facebook, X/Twitter, Website, YouTube, Instagram, LinkedIn, Other)
- View all links or filter by specific category
- Copy all links from a category with one click
- Prevent duplicate links
- Track statistics (total links, categories)
- Responsive design
- Server-side PostgreSQL database (Vercel Postgres)
- Multi-device access with 99%+ uptime
- Modern React-based UI with Next.js

## File Structure

```
link-collector/
├── app/
│   ├── api/
│   │   ├── links/route.js      # API endpoints for link operations
│   │   └── stats/route.js      # API endpoint for statistics
│   ├── add/
│   │   └── page.js             # Add link page
│   ├── view/
│   │   └── page.js             # View links page
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout
│   └── globals.css             # Global styles
├── lib/
│   └── db.js                   # Database utilities
├── package.json                # Dependencies
├── next.config.js              # Next.js configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

## Requirements

- Node.js 18.x or higher
- npm or yarn
- Vercel account (free tier available)
- GitHub account

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# For local development with Vercel Postgres
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"
```

3. Run development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Initialize git repository (if not already):
```bash
git init
git add .
git commit -m "Initial commit - Next.js Link Collector"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/link-collector.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New Project"

3. Import your `link-collector` repository

4. Vercel will auto-detect Next.js - click "Deploy"

### Step 3: Set up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab

2. Click "Create Database" and select "Postgres"

3. Choose a database name and region (select closest to your users)

4. Click "Create"

5. Vercel will automatically add the required environment variables to your project

6. Redeploy your application:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### Step 4: Access Your Application

Your app will be live at: `https://your-project-name.vercel.app`

The database will automatically initialize on the first request!

## Usage

### Adding Links

1. Click "Add Link" in the navigation
2. Enter a valid URL (e.g., https://example.com)
3. Select a category from the dropdown
4. Click "Add Link"
5. The system will prevent duplicate URLs

### Viewing Links

1. Click "View Links" in the navigation
2. Use the category filter dropdown to:
   - View all links (grouped by category)
   - Filter by specific category
3. Click "Copy All Links" button to copy all URLs from a category to clipboard

### URL Filtering

Access links directly by category using URL parameters:
- All links: `/view?category=all`
- Facebook links: `/view?category=facebook`
- X/Twitter links: `/view?category=x`
- Website links: `/view?category=website`
- YouTube links: `/view?category=youtube`
- Instagram links: `/view?category=instagram`
- LinkedIn links: `/view?category=linkedin`
- Other links: `/view?category=other`

## Database Schema

The PostgreSQL database contains one table:

```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON links(category);
```

## API Endpoints

### GET /api/stats
Returns statistics about links:
```json
{
  "totalLinks": 10,
  "totalCategories": 3,
  "categoryStats": [...],
  "recentLinks": [...]
}
```

### GET /api/links
Query parameters:
- `category`: Filter by category (optional)
- `action=categories`: Get all categories

### POST /api/links
Add a new link:
```json
{
  "url": "https://example.com",
  "category": "website"
}
```

## Security Features

- Parameterized queries to prevent SQL injection
- URL validation before insertion
- React's built-in XSS protection
- Unique constraint on URLs
- HTTPS enforced on Vercel

## Customization

### Adding New Categories

Edit `app/add/page.js` and add new options in the category select:

```jsx
<option value="new_category">New Category</option>
```

### Styling

Modify `app/globals.css` to change colors, fonts, and layout.

## Troubleshooting

**Build fails:**
- Ensure Node.js version is 18.x or higher: `node --version`
- Delete `node_modules` and `.next` folders, then run `npm install` again

**Database connection issues:**
- Verify Vercel Postgres is created and connected to your project
- Check environment variables are set in Vercel dashboard
- Redeploy after adding database

**Links not saving:**
- Check Vercel function logs in the dashboard
- Verify database connection environment variables
- Ensure database table was created (happens automatically on first request)

## Environment Variables

Required for production (automatically set by Vercel when you create Postgres database):
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Performance & Reliability

- **99%+ Uptime**: Hosted on Vercel's global edge network
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Fast loading from anywhere in the world
- **Serverless Functions**: No server maintenance required
- **Automatic HTTPS**: SSL certificates managed automatically

## License

Free to use and modify.
