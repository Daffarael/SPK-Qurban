
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                },
                success: {
                    iconTheme: { primary: '#10b981', secondary: '#fff' }
                },
                error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' }
                }
            }}
        />
    );
}
