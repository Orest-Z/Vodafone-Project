// app/layout.tsx
import './styles.css'; // ✅ Fix: Relative import for side-by-side files
import '@fontsource/archivo/latin-700.css';
import '@fontsource/archivo/latin-800.css';
import '@fontsource/archivo/latin-900.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/ubuntu/latin-300.css';
import '@fontsource/ubuntu/latin-400.css';
import '@fontsource/ubuntu/latin-500.css';
import '@fontsource/ubuntu/latin-700.css';
import { ThemeProvider } from '@/shared/components/ThemeProvider'; // 👈 Use your new wrapper!
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tourist SIM & eSIM Packs for Albania | Vodafone Tourist Pack',
  description:
    'Instant Vodafone eSIM and SIM tourist packs for Albania. Nationwide 4G/5G data, minutes, and exclusive local perks — activate online in minutes, no store visit needed.',
  keywords: [
    'Albania eSIM',
    'Albania SIM card',
    'tourist SIM Albania',
    'Vodafone Albania tourist pack',
    'Albania travel data plan',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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