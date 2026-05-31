import "./globals.css";

export const metadata = {
  title: "Кадар — Balkan Cinema",
  description: "A curated database of short films and music videos from across the Balkans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}