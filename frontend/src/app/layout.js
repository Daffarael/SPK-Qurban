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
      <head>
        <script
          src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-yXalI7AAkxGj0poV'}
          async
        />
      </head>
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
