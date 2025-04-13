"use client";
import { useAuth } from "@/hooks/useAuth";
import { auth, googleProvider, facebookProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const { user, loading } = useAuth();
    const [error, setError] = useState("");
    const router = useRouter();

    // Redirect logged-in users to the dashboard
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            localStorage.setItem("authToken", token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const token = await result.user.getIdToken();
            localStorage.setItem("authToken", token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="loader">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="mx-4 mt-40 p-6 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome Back!</h1>
                <p className="text-center text-gray-600 mb-4">Log in to your account</p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-md"
                >
                    <FcGoogle className="text-2xl bg-white rounded-full p-0.5" />
                    Log in with Google
                </button>

                <button
                    onClick={handleFacebookLogin}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-md mt-4"
                >
                    <AiFillFacebook className="text-2xl" />
                    Log in with Facebook
                </button>

                {error && (
                    <p className="text-red-500 text-center text-sm mt-4">{error}</p>
                )}
            </div>
        </div>
    );
}
