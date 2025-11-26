import './globals.css';

export const metadata = {
  title: 'Link Collector',
  description: 'Collect and organize your links by category',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
