"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { MdDirectionsBus } from "react-icons/md";
import { useRouter } from "next/navigation"; // Import Next.js router

interface Category {
    _id: string;
    type: string;
    name: string;
}

export default function Expense() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false); // Loading state for submission
    const [error, setError] = useState(""); // Error message for validation
    const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                // Make the API call with the token in the Authorization header
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token
                    },
                });

                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!selectedCategory || !amount || !date) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true); // Start loading
        setError(""); // Clear previous errors

        const transactionData = {
            category: selectedCategory,
            amount: parseFloat(amount),
            note,
            date,
            type: "expense",
        };

        try {
            const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            // Make the API call with the token in the Authorization header
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, transactionData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token
                },
            });

            // Reset form
            setSelectedCategory(null);
            setAmount("");
            setNote("");
            setDate(new Date().toISOString().split("T")[0]);

            // Redirect to home page using Next.js router
            router.push("/");
        } catch (error) {
            console.error("Error posting transaction:", error);
            setError("Failed to add transaction.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-blue-500 text-white text-center py-4 sticky top-0 z-10">
                <Link href="/" className="absolute left-4 top-3 text-white text-xl">
                    <HiChevronLeft className="text-4xl" />
                </Link>
                <h1 className="text-lg font-semibold">အသုံးစရင်းရေးသွင်း</h1>
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full px-6 mt-4">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {/* Category Selection */}
            <div className="mt-4 w-full px-6 text-gray-700 font-medium text-base">
                အမျိုးအစားရွေးပါ
            </div>
            <div className="mt-4 px-6 w-full">
                {!selectedCategory ? (
                    <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                        {categories
                            .filter((item) => item.type === "expense")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center text-sm text-gray-700 cursor-pointer ${
                                        selectedCategory === item._id
                                            ? "border-2 border-blue-500"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedCategory(item._id)}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${
                                            index % 2 === 0 ? "bg-green-500" : "bg-yellow-500"
                                        }`}
                                    >
                                        <MdDirectionsBus />
                                    </div>
                                    <span className="mt-2 text-center">{item.name}</span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
                        <span className="text-gray-700 font-medium">
                            {categories.find((item) => item._id === selectedCategory)?.name}
                        </span>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-gray font-semibold"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>

            {/* Amount Section */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">ပမာဏ</label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full mt-2 p-2 rounded-md bg-blue-50 text-gray ${
                        !amount && error ? "border border-red-500" : ""
                    }`}
                />
            </div>

            {/* Notes Section */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray font-medium">မှတ်စု</label>
                <textarea
                    placeholder="Enter Notes"
                    rows={4}
                    maxLength={200}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full mt-2 p-2 rounded-md bg-blue-50 text-gray"
                ></textarea>
            </div>

            {/* Date Picker */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">နေ့ ရက်</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full mt-2 p-2 rounded-md bg-blue-50 text-gray ${
                        !date && error ? "border border-red-500" : ""
                    }`}
                />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 w-full px-6 space-y-3">
                <button
                    disabled={!selectedCategory || !amount || !date || loading}
                    onClick={handleSubmit}
                    className={`w-full bg-blue-500 text-white py-3 rounded-full font-semibold ${
                        !selectedCategory || !amount || !date || loading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    {loading ? "Submitting..." : "အတည်ပြုမည်"}
                </button>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setAmount("");
                        setNote("");
                        setDate(new Date().toISOString().split("T")[0]);
                        setError("");
                    }}
                    className="w-full border border-blue-500 text-gray py-3 rounded-full font-semibold"
                >
                    ပယ်ဖျက်မည်
                </button>
            </div>
        </div>
    );
}
