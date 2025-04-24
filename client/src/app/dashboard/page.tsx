"use client";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/apiMiddleware"; // Import the middleware to fetch data
import "font-awesome/css/font-awesome.min.css";
import Loading from "@/components/Loading";

interface Transaction {
    _id: string;
    date: string;
    amount: number;
    type: string;
    category: {
        name: string;
    };
    note: string;
}

export default function Dashboard() {
    const [filter, setFilter] = useState<"current" | "previous" | "all">("current");

    // Fetch transactions using React Query
    const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
        queryKey: ["transactions"], // Query key
        queryFn: async () => {
            const response = await apiClient.get("/transactions");
            return response.data;
        },
    });

    // Filter transactions based on the selected filter
    const filteredTransactions = transactions.filter((transaction) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const transactionDate = new Date(transaction.date);

        if (filter === "current") {
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );
        } else if (filter === "previous") {
            return (
                transactionDate.getMonth() === currentMonth - 1 &&
                transactionDate.getFullYear() === currentYear
            );
        }
        return true; // For "all" filter
    });

    // Calculate total amounts
    const amounts = filteredTransactions.reduce((total, transaction) => {
        if (transaction.type === "income") {
            return total + transaction.amount;
        } else if (transaction.type === "expense") {
            return total - transaction.amount;
        }
        return total;
    }, 0);

    const incomeAmounts = filteredTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Error fetching transactions. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            {/* Header */}
            <header className="bg-blue-500 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">Money History</h1>
            </header>

            {/* Filter Buttons */}
            <div className="bg-blue-500 flex justify-center p-2">
                <div className="flex gap-2 bg-white border-2 border-blue-300 rounded-b-sm shadow-md">
                    <button
                        onClick={() => setFilter("previous")}
                        className={`p-2 text-sm transition ${
                            filter === "previous"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600"
                        }`}
                    >
                        ယခင်လ
                    </button>
                    <button
                        onClick={() => setFilter("current")}
                        className={`p-2 text-sm transition ${
                            filter === "current"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600"
                        }`}
                    >
                        ယခုလ
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`p-2 text-sm transition ${
                            filter === "all"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600"
                        }`}
                    >
                        အားလုံး
                    </button>
                </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white p-6 mt-4 mx-4 rounded-lg shadow-md sticky top-0 z-10">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">
                        {filter === "current"
                            ? "ယခုလ ရှိငွေ"
                            : filter === "previous"
                            ? "ယခင်လ ရှိငွေ"
                            : "လက်ရှိငွေ"}
                    </h2>
                    <p className="text-3xl font-bold mt-2">
                        {amounts.toLocaleString()} MMK
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="flex justify-around gap-4 mt-4 mx-4">
                <Link href="/income">
                    <div className="bg-green-100 hover:bg-green-200 transition rounded-xl shadow-md py-4 px-2 w-36 text-center border-2 border-green-300">
                        <div className="text-green-500 text-3xl">⬆</div>
                        <p className="mt-2 mb-2 text-sm font-bold">ဝင်ငွေ</p>
                        <p className="font-semibold text-gray-800">
                            {incomeAmounts.toLocaleString()} MMK
                        </p>
                    </div>
                </Link>
                <Link href="/expense">
                    <div className="bg-red-100 hover:bg-red-200 transition rounded-xl shadow-md py-4 px-2 w-36 text-center border-2 border-red-300">
                        <div className="text-red-500 text-3xl">⬇</div>
                        <p className="mt-2 mb-2 text-sm font-bold">ထွက်ငွေ</p>
                        <p className="font-semibold text-gray-800">
                            {Math.abs(amounts - incomeAmounts).toLocaleString()} MMK
                        </p>
                    </div>
                </Link>
            </div>

            {/* Buttons for Month Total and Chart */}
            <div className="flex flex-col items-center gap-4 mt-5 mx-8">
                <Link
                    href={"/chart"}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-500 px-4 py-2 rounded-lg shadow-md transition w-full border-2 border-blue-300 text-center"
                >
                    စာရင်းပြ Chart များ
                </Link>
                <Link
                    href={"/summary"}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-500 px-4 py-2 rounded-lg shadow-md transition w-full border-2 border-purple-300 text-center"
                >
                    စာရင်းချုပ်
                </Link>
            </div>

            {/* Transaction List */}
            <div className="bg-white p-6 mt-5 mb-12 mx-4 rounded-lg shadow-md">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center text-gray-500">
                        စာရင်းမရှိပါ။
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredTransactions.map((transaction, index) => (
                            <Link
                                key={index}
                                href={`/${transaction.type === "income" ? "income" : "expense"}/edit?id=${transaction._id}`}
                            >
                                <div
                                    className={`${
                                        transaction.type === "income"
                                            ? "bg-gray-50"
                                            : "bg-gray-150"
                                    } rounded-xl shadow-lg p-4 hover:shadow-xl transition cursor-pointer`}
                                >
                                    <p className="text-gray-600 text-sm mb-1">
                                        {new Date(transaction.date).toLocaleDateString("my-MM", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <i
                                                className={`fa fa-usd ${
                                                    transaction.type === "income"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                } text-xl`}
                                            ></i>
                                            <span>
                                                {transaction.category?.name || "Unknown Category"}
                                            </span>
                                        </div>
                                        <div
                                            className={`${
                                                transaction.type === "income"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"}
                                            {Number(transaction.amount || 0).toLocaleString()} MMK
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {transaction.note || "No notes available."}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
