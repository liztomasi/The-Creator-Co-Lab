import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Creator Co-Lab LLC | Liz Tomasi',
  description:
    'Remote consulting for nonprofits, small businesses, and startups. Operations, CRM strategy, social media, and AI integration — nationwide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
