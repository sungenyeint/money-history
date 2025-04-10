"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import "font-awesome/css/font-awesome.min.css";

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("current"); // Filter state (current, previous, all)

    useEffect(() => {
        // Fetch transaction data from the API
        axios
            .get("http://localhost:5000/api/transactions")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            })
            .catch((error) => console.error("Error fetching transaction data:", error))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Filter transactions based on the selected filter
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let filtered = transactions;

        if (filter === "current") {
            filtered = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                return (
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            });
        } else if (filter === "previous") {
            filtered = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                return (
                    transactionDate.getMonth() === currentMonth - 1 &&
                    transactionDate.getFullYear() === currentYear
                );
            });
        }

        setFilteredTransactions(filtered);
    }, [filter, transactions]);

    // Calculate total amounts
    const amounts = (filteredTransactions || []).reduce((total, transaction) => {
        if (transaction && transaction.type === "income") {
            return total + Number(transaction.amount || 0);
        } else if (transaction && transaction.type === "expense") {
            return total - Number(transaction.amount || 0);
        }
        return total;
    }, 0);

    const incomeAmounts = (filteredTransactions || [])
        .filter((transaction) => transaction && transaction.type === "income")
        .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

    return (
        <div className="min-h-screen bg-gray-100 mb-18 text-gray-800 flex flex-col">
            {loading ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <div className="loader">
                        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="text-center py-8 bg-blue-500 text-white sticky top-0 z-10 flex flex-col items-center">
                        <h1 className="text-xl font-semibold m-3">လက်ရှိပိုက်ဆံ</h1>
                        <p className="text-4xl font-bold">{amounts.toLocaleString()} MMK</p>
                        <div className="mt-4 flex gap-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-blue-600 text-white px-4 py-2 text-sm text-center transition appearance-none"
                            >
                                <option value="previous">Previous Month</option>
                                <option value="current">Current Month</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="bg-white rounded-t-3xl p-6 flex flex-col gap-6 text-gray-800 shadow-lg">
                        <div className="flex justify-around gap-4">
                            <Link href="/income">
                                <div className="bg-green-100 hover:bg-green-200 transition rounded-xl shadow-md py-4 px-2 w-36 text-center border-2 border-green-300">
                                    <div className="text-green-500 text-3xl">⬆</div>
                                    <p className="mt-2 mb-2 text-sm font-bold">ဝင်ငွေ</p>
                                    <p className="font-semibold text-gray-800">{incomeAmounts.toLocaleString()} MMK</p>
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
                        <div className="flex flex-col items-center gap-4 mt-4">
                            <Link href={"/chart"}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-500 px-4 py-2 rounded-lg shadow-md transition w-full border-2 border-blue-300 text-center"
                            >
                                စာရင်းပြ Chart များ
                            </Link>
                            <Link href={"/summary"}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-500 px-4 py-2 rounded-lg shadow-md transition w-full border-2 border-purple-300 text-center"
                            >
                                စာရင်းချုပ်
                            </Link>
                        </div>

                        {/* Transaction List */}
                        {filteredTransactions.length === 0 && (
                            <div className="text-center text-gray-500">
                                No transactions available for the selected filter.
                            </div>
                            )
                        }
                        <div className="flex flex-col gap-4">
                            {filteredTransactions.map((transaction, index) => (
                                <Link
                                    key={index}
                                    href={`/${transaction.type === "income" ? "income" : "expense"}/edit?id=${transaction._id}`}
                                >
                                    <div
                                        className={`${
                                            transaction.type === "income" ? "bg-gray-50" : "bg-gray-150"
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
                                                <span>{transaction.category?.name || "Unknown Category"}</span>
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
                    </div>
                </>
            )}
        </div>
    );
}
