"use client";
import { useAuth } from "@/hooks/useAuth";
import { auth, googleProvider, facebookProvider } from "@/utils/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationScheme } from "@/utils/validationSchemas";

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const { user, loading } = useAuth();
    const [error, setError] = useState("");
    const router = useRouter();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginValidationScheme),
    });

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

    const handleEmailLogin = async (data: LoginFormData) => {
        try {
            const result = await signInWithEmailAndPassword(auth, data.email, data.password);
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

    return loading ? (
        <Loading />
    ) : (
        <div className="min-h-screen flex flex-col">
            <div className="mx-4 mt-40 p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Money History</h1>
                <p className="text-center text-gray-600 mb-4">Log in to your account</p>

                {/* Email and Password Login */}
                <form
                    onSubmit={handleSubmit(handleEmailLogin)}
                    className="mb-6"
                    autoComplete="off"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className={`w-full border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md p-3`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className={`w-full border ${
                            errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-md p-3 mt-4`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-400 hover:bg-blue-700 text-white py-3 mt-4"
                    >
                        Log in
                    </button>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 my-6">
                    Don&apos;t have an account?{" "}
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
