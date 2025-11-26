import './globals.css'

export const metadata = {
  title: 'Link Collector',
  description: 'Organize and manage your links by category',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
