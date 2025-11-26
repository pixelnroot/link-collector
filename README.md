# Link Collector

A simple and elegant link management application built with Next.js and MongoDB. Collect, categorize, and organize your favorite links with ease.

## Features

- Add links with custom categories
- Automatic duplicate link detection
- Filter links by category
- View all links or filter by specific categories
- Copy individual links or all filtered links at once
- Beautiful, responsive UI
- Ready for Vercel deployment

## Tech Stack

- Next.js 14 (App Router)
- MongoDB for data storage
- React for UI components
- CSS for styling

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works great)
- Vercel account (optional, for deployment)

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd link-collector
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkCollector?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster` with your cluster name

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your repository
5. Add environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variable:
```bash
vercel env add MONGODB_URI
```

Paste your MongoDB connection string when prompted.

5. Deploy to production:
```bash
vercel --prod
```

## Usage

### Adding Links

1. Navigate to the home page
2. Enter a URL (must be a valid URL format)
3. Enter a category name
4. Click "Add Link"
5. The app will prevent duplicate links automatically

### Viewing Links

1. Click "View Links" in the navigation
2. Use the dropdown to filter by category or select "All Categories"
3. Click "Copy" on individual links to copy them to clipboard
4. Click "Copy All Links" to copy all filtered links at once

## Project Structure

```
link-collector/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   └── route.js       # API endpoints for links
│   │   └── categories/
│   │       └── route.js       # API endpoint for categories
│   ├── view/
│   │   └── page.js            # View links page
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Home page (add links)
├── lib/
│   └── mongodb.js             # MongoDB connection utility
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── vercel.json                # Vercel configuration
└── README.md                  # This file
```

## API Endpoints

### POST /api/links
Add a new link

Request body:
```json
{
  "url": "https://example.com",
  "category": "Tutorial"
}
```

### GET /api/links
Get all links or filter by category

Query parameters:
- `category` (optional): Filter by specific category

### GET /api/categories
Get all unique categories

## Database Schema

### Links Collection

```javascript
{
  _id: ObjectId,
  url: String (unique),
  category: String,
  createdAt: Date
}
```

## Features Explained

### Unique Link Enforcement

The application ensures that each link is stored only once by:
1. Checking for duplicates before insertion
2. Creating a unique index on the `url` field in MongoDB
3. Handling duplicate key errors gracefully

### Category Management

Categories are dynamically managed:
- No predefined category list needed
- Categories are created when first used
- The category filter shows only categories that have links

### Copy Functionality

- Individual copy: Copies a single link to clipboard
- Bulk copy: Copies all visible links (respects category filter)
- Visual feedback with success messages

## Troubleshooting

### MongoDB Connection Issues

If you see connection errors:
1. Check your MongoDB URI is correct
2. Verify your IP address is whitelisted in MongoDB Atlas
3. Ensure your database user has proper permissions

### Build Errors

If deployment fails:
1. Make sure all dependencies are in `package.json`
2. Verify environment variables are set in Vercel
3. Check build logs for specific errors

### Environment Variables

Remember to:
- Never commit `.env.local` to git
- Set `MONGODB_URI` in Vercel dashboard for production
- Use the exact variable name `MONGODB_URI`

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
