// app/layout.tsx
import './styles.css'; // ✅ Fix: Relative import for side-by-side files
import { Archivo, Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider'; // 👈 Use your new wrapper!
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${manrope.variable}`}>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <div className="page">
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}