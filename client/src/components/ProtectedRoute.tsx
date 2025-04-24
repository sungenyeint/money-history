"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "./Loading";
import Footer from "./Footer";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth(); // Get user and loading state from useAuth
    const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    return (
        loading ? (
            <Loading />
        ) : (
            <>
                {children}
                {user && <Footer />}
            </>
        )
    );
}
