'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Inter } from 'next/font/google'

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
});

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.className} antialiased`}>
            <body>
                <QueryClientProvider client={queryClient}>
                    <ProtectedRoute>
                        {children}
                    </ProtectedRoute>
                </QueryClientProvider>
            </body>
        </html>
    );
}
