"use client";
import { useAuth } from "@/hooks/useAuth";
import { auth, googleProvider, facebookProvider } from "@/utils/firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function Login() {
    const { user, loading } = useAuth();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const token = await result.user.getIdToken();
            localStorage.setItem("authToken", token);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log(result);
            const token = await result.user.getIdToken();
            localStorage.setItem("authToken", token);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    const handleSignUp = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created:", result.user);
        } catch (err) {
            console.error("Sign Up Error:", err);
        }
    };

    return loading ? (
        <Loading />
    ) : (
        <div className="min-h-screen flex flex-col">
            <div className="mx-4 mt-40 p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Money History</h1>
                <p className="text-center text-gray-600 mb-4">Log in to your account</p>

                {/* Email and Password Login */}
                <form onSubmit={handleEmailLogin} className="mb-6" autoComplete="off">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-400 hover:bg-blue-700 text-white py-3"
                    >
                        Log in
                    </button>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 my-6">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Sign up
                    </Link>
                </p>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-md"
                >
                    <FcGoogle className="text-2xl bg-white rounded-full p-0.5" />
                    Log in with Google
                </button>

                {/* Facebook Login */}
                <button
                    onClick={handleFacebookLogin}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-md mt-4"
                >
                    <AiFillFacebook className="text-2xl" />
                    Log in with Facebook
                </button>

                {/* Error Message */}
                {error && (
                    <p className="text-red-500 text-center text-sm mt-4">{error}</p>
                )}
            </div>
        </div>
    );
}
