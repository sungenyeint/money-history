"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { FaFilter } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function ChartPage() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [incomeData, setIncomeData] = useState({ labels: [], amounts: [] });
    const [expenseData, setExpenseData] = useState({ labels: [], amounts: [] });
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                // Make the API call with the token in the Authorization header
                const response = await axios.get("http://localhost:5000/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token
                    },
                });

                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching transaction data:", error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        // Filter transactions by year and month
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return (
                transactionDate.getFullYear() === filterYear &&
                transactionDate.getMonth() + 1 === filterMonth
            );
        });
        setFilteredTransactions(filtered);
    }, [transactions, filter]);

    useEffect(() => {
        // Process data for income and expense charts
        const incomeCategories = {};
        const expenseCategories = {};

        filteredTransactions.forEach((transaction) => {
            const category = transaction.category?.name || "Unknown";
            const amount = Number(transaction.amount || 0);

            if (transaction.type === "income") {
                incomeCategories[category] = (incomeCategories[category] || 0) + amount;
            } else if (transaction.type === "expense") {
                expenseCategories[category] = (expenseCategories[category] || 0) + amount;
            }
        });

        setIncomeData({
            labels: Object.keys(incomeCategories),
            amounts: Object.values(incomeCategories),
        });

        setExpenseData({
            labels: Object.keys(expenseCategories),
            amounts: Object.values(expenseCategories),
        });
    }, [filteredTransactions]);

    const incomeChartData = {
        labels: incomeData.labels,
        datasets: [
            {
                data: incomeData.amounts,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const expenseChartData = {
        labels: expenseData.labels,
        datasets: [
            {
                data: expenseData.amounts,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(255, 205, 86, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(255, 205, 86, 1)",
                    "rgba(201, 203, 207, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.label}: ${value.toLocaleString()} MMK`;
                    },
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-18 flex flex-col items-center">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-blue-600 text-white shadow-md">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-white text-2xl">
                        <HiChevronLeft />
                    </Link>

                    <h1 className="text-lg font-semibold">စာရင်း ပြ Chart များ</h1>

                    <div className="relative">
                        <FaFilter
                            className="text-xl cursor-pointer"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        />

                        {showDatePicker && (
                            <div className="absolute right-0 mt-2 w-72 rounded-md bg-white p-4 shadow-lg z-20 text-black">
                                <div className="relative mb-4">
                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="absolute top-0 right-0 bold font-semibold hover:text-gray-700 focus:outline-none"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {/* Year Selector */}
                                    <div>
                                        <label className="block font-semibold mb-1">Year</label>
                                        <select
                                            value={filterYear}
                                            onChange={(e) => setFilterYear(Number(e.target.value))}
                                            className="w-full rounded border-gray-300 text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {Array.from({ length: 10 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    {/* Month Selector */}
                                    <div>
                                        <label className="block font-semibold mb-1">Month</label>
                                        <select
                                            value={filterMonth}
                                            onChange={(e) => setFilterMonth(Number(e.target.value))}
                                            className="w-full rounded border-gray-300 text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Apply Filter Button */}
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                setFilteredTransactions(transactions);
                                                setShowDatePicker(false);
                                            }}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilterYear(new Date().getFullYear());
                                                setFilterMonth(new Date().getMonth() + 1);
                                                setFilter(!filter);
                                                setShowDatePicker(false);
                                            }}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                        >
                                            Current
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFilter(!filter);
                                                setShowDatePicker(!showDatePicker);
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="flex items-center justify-center h-screen text-gray-500">
                    <p>စာရင်းမရှိပါ။</p>
                </div>
            ) : (
                <div>
                    {/* Income Chart */}
                    <div className="w-full px-6 mt-6">
                        <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                            ၀င်ငွေပြ Chart များ
                        </h2>
                        <Doughnut data={incomeChartData} options={options} />
                    </div>

                    {/* Expense Chart */}
                    <div className="w-full px-6 mt-6">
                        <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                            ထွက်ငွေပြ Chart များ
                        </h2>
                        <Doughnut data={expenseChartData} options={options} />
                    </div>
                </div>
            )}

        </div>
    );
}
