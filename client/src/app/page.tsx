"use client";
import Loading from "@/components/Loading";
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
        <Loading /> // Render Loading component
    );
}
