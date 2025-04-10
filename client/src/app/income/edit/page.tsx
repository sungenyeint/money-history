"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { MdDeleteForever, MdDirectionsBus } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

export default function EditIncome() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Get the "id" from the query string

    const [transaction, setTransaction] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch transaction details
        if (id) {
            axios
                .get(`http://localhost:5000/api/transactions/${id}`)
                .then((response) => {
                    const data = response.data;
                    setTransaction(data);
                    setSelectedCategory(data.category?._id || null);
                    setAmount(data.amount || '');
                    setNote(data.note || '');
                    setDate(new Date(data.date).toISOString().split('T')[0]);
                })
                .catch((error) => console.error("Error fetching transaction:", error));
        }

        // Fetch categories
        axios
            .get("http://localhost:5000/api/categories")
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, [id]);

    const handleSubmit = async () => {
        if (!selectedCategory || !amount || !date) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setError('');

        const updatedTransaction = {
            category: selectedCategory,
            amount: parseFloat(amount),
            note,
            date,
            type: "income",
        };

        try {
            await axios.put(`http://localhost:5000/api/transactions/${id}`, updatedTransaction);
            // alert("Transaction updated successfully!");
            window.location.href = "/";
        } catch (error) {
            console.error("Error updating transaction:", error);
            setError("ailed to update transaction.");
            // alert("Failed to update transaction.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`http://localhost:5000/api/transactions/${id}`);
                window.location.href = "/";
            } catch (error) {
                console.error("Error deleting transaction:", error);
                setError("Error deleting transaction:");
            }
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-blue-500 text-white text-center py-4 sticky top-0 z-10">
                <Link href="/" className="absolute left-4 top-3 text-white text-xl">
                    <HiChevronLeft className="text-4xl" />
                </Link>
                <h1 className="text-lg font-semibold">ပြင်ဆင်ရန်</h1>
                <button
                    onClick={handleDelete}
                    className="absolute right-4 top-3 text-white text-xl"
                >
                    <MdDeleteForever className="text-4xl" />
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full px-6 mt-4">
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            )}

            {/* Category Selection */}
            <div className="mt-4 w-full px-6 text-gray-700 font-medium text-base">
                အမျိုးအစားရွေးရန်
            </div>
            <div className="mt-4 px-6 w-full">
            {!selectedCategory ? (
                    <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                        {categories
                            .filter(item => item.type === "income")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center text-sm text-gray-700 cursor-pointer ${selectedCategory === item._id ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setSelectedCategory(item._id)}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${index % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        <MdDirectionsBus />
                                    </div>
                                    <span className="mt-2 text-center">{item.name}</span>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
                        <span className="text-gray-700 font-medium">
                            {categories.find(item => item._id === selectedCategory)?.name}
                        </span>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-gray font-semibold"
                        >
                            <FiEdit className="inline-block mr-1" />
                        </button>
                    </div>
                )}
            </div>

            {/* Amount Input */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">ပမာဏ</label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mt-2 p-2 rounded-md bg-blue-50 text-gray"
                />
            </div>

            {/* Note Input */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">မှတ်စု</label>
                <textarea
                    placeholder="Enter note"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full mt-2 p-2 rounded-md bg-blue-50 text-gray"
                ></textarea>
            </div>

            {/* Date Input */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">နေ့ ရက်</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-2 p-2 rounded-md bg-blue-50 text-gray"
                />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 w-full px-6 space-y-3">
                <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`w-full bg-blue-500 text-white py-3 rounded-full font-semibold ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? "လုပ်ဆောင်ဆဲ..." : "အတည်ပြုမည်"}
                </button>
                <Link
                    href="/"
                    className="w-full border border-blue-500 text-gray py-3 rounded-full font-semibold text-center block"
                >
                    ပယ်ဖျက်မည်
                </Link>
            </div>
        </div>
    );
}
