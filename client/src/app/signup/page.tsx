"use client";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpValidationSchema } from "@/utils/validationSchemas";
import Link from "next/link";

interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignUp() {
    const router = useRouter();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: yupResolver(signUpValidationSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
            console.log("User created:", result.user);
            router.push("/login"); // Redirect to login page after successful sign-up
        } catch (err: unknown) {
            console.error("Sign Up Error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center">
            <div className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className={`w-full border ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2 mt-1`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className={`w-full border ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2 mt-1`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className={`w-full border ${
                                errors.confirmPassword ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2 mt-1`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
