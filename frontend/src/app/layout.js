import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import ToasterProvider from '@/components/common/ToasterProvider';

export const metadata = {
  title: 'Sapi Qurban - PT Ghaffar Farm Bersaudara',
  description: 'Pilih sapi qurban terbaik dengan kualitas terjamin. PT Ghaffar Farm Bersaudara - Baru Setiap Hari.',
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
