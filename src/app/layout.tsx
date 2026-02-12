import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MGFD Portfolio',
  description:
    'Portfolio de Mateo G. Fontana Dalmasso con proyectos de UX/UI y diseño gráfico para OTT, productos digitales y e-commerce.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inclusive+Sans:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
