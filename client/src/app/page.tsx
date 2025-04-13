"use client";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import { useEffect } from "react";

export default function Home() {
    const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
        // Automatically redirect to /dashboard
        router.push("/dashboard");
    }, [router]);

    // Optionally, show a loading spinner while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="loader">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
            </div>
        </div>
    );
}
