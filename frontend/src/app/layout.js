import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import ToasterProvider from '@/components/common/ToasterProvider';

export const metadata = {
  title: 'SPK Sapi Qurban - PT Ghaffar Farm Bersaudara',
  description: 'Sistem Penunjang Keputusan pemilihan sapi qurban terbaik menggunakan metode SAW. PT Ghaffar Farm Bersaudara - Baru Setiap Hari.',
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToasterProvider />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
