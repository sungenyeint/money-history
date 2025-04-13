"use client";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { FaUserCircle } from "react-icons/fa";
import { HiChevronLeft } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; // Import Next.js router for navigation

export default function SettingPage() {
    const { user, loading } = useAuth(); // Get user and loading state from useAuth
    const router = useRouter(); // Initialize Next.js router

    async function handleLogout() {
        try {
            await signOut(auth); // Sign out the user
            router.push("/login"); // Redirect to the login page
            console.log("User logged out");
        } catch (err) {
            console.error("Error logging out:", err);
            alert("Failed to log out. Please try again."); // Provide feedback to the user
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white py-4 px-6 flex items-center justify-between shadow-md">
                {/* Back Icon */}
                <Link href="/" className="text-white text-2xl">
                    <HiChevronLeft />
                </Link>
                <h1 className="text-xl font-bold">Settings</h1>
                {/* Logout Icon */}
                <button onClick={handleLogout} className="text-white text-2xl">
                    <FiLogOut />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-start py-6 px-4">
                {user ? (
                    <div className="bg-white shadow-lg rounded-lg p-8 w-90 flex flex-col items-center">
                        {/* User Icon */}
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-4xl mb-4">
                            <FaUserCircle className="w-16 h-16" />
                        </div>
                        {/* User Info */}
                        <h2 className="text-lg font-semibold">{user.displayName || "User"}</h2>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">No user is logged in.</p>
                )}
            </div>
        </div>
    );
}
