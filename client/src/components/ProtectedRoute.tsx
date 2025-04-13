"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth(); // Get user and loading state from useAuth
    const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    if (loading) {
        // Show a loading spinner while authentication state is being determined
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="loader">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    // Render the children if the user is authenticated
    return <>{children}</>;
}
