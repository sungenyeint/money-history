'use client';
import type { Metadata } from "next";
import "../styles/globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConditionalFooter from "@/components/ConditionalFooter"; // Import the new ConditionalFooter component

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
                {/* Render ConditionalFooter */}
                <ConditionalFooter />
            </body>
        </html>
    );
}
