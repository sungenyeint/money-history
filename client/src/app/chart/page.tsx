"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
    TooltipItem,
} from "chart.js";
import apiClient from "@/utils/apiMiddleware";
import { useQuery } from "@tanstack/react-query";
import { LiaFilterSolid } from "react-icons/lia";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

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

interface ChartData {
    labels: string[];
    amounts: number[];
}

export default function ChartPage() {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [incomeData, setIncomeData] = useState<ChartData>({ labels: [], amounts: [] });
    const [expenseData, setExpenseData] = useState<ChartData>({ labels: [], amounts: [] });
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0].slice(0, 7));
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("month");
    const [filter, setFilter] = useState<boolean>(false);
    const [showDateData, setShowDateData] = useState<string>(new Date().toLocaleString("my-MM", {month: "long", year: "numeric"}));

    // Fetch transactions using React Query
    const { data: transactions = [] } = useQuery<Transaction[]>({
        queryKey: ["transactions"], // Query key
        queryFn: async () => {
            const response = await apiClient.get("/transactions");
            return response.data;
        },
    });

    useEffect(() => {
        // Filter transactions by year and month
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const filterYear = parseInt(selectedDate.split("-")[0]);
            const filterMonth = parseInt(selectedDate.split("-")[1]);

            if (activeTab === "year") {
                return transactionDate.getFullYear() === filterYear;
            } else if (activeTab === "month") {
                return (
                    transactionDate.getFullYear() === filterYear &&
                    transactionDate.getMonth() + 1 === filterMonth
                );
            }
        });
        setFilteredTransactions(filtered);
    }, [transactions, filter]);

    useEffect(() => {
        // Process data for income and expense charts
        const incomeCategories: Record<string, number> = {};
        const expenseCategories: Record<string, number> = {};

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

    const changeTabHandler = (tab: string) => () => {
        setActiveTab(tab);
        if (tab === "month") {
            setSelectedDate(new Date().toISOString().split("T")[0].slice(0, 7)); // Reset selected date to current month
        } else if (tab === "year") {
            setSelectedDate(`${new Date().getFullYear()}-01`); // Reset selected date to current year
        }
    };

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

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'doughnut'>) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
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

                    <h1 className="text-lg font-semibold">စာရင်းပြ Chart များ</h1>

                    <div className="relative">
                        <LiaFilterSolid
                            className="text-xl cursor-pointer size-6 text-white"
                            onClick={() => {
                                setShowDatePicker(!showDatePicker);
                                setFilter(!filter);
                            }}
                        />

                        {showDatePicker && (
                            <div className="absolute right-0 mt-2 w-72 rounded-md bg-white p-4 shadow-lg z-20 text-black">
                                <div className="relative mb-8">
                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="absolute top-0 right-0 bold font-semibold hover:text-gray-700 focus:outline-none"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex justify-between mb-4 bg-blue-100 rounded-lg overflow-hidden">
                                    {["month", "year"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={changeTabHandler(tab)}
                                            className={`flex-1 py-2 text-sm font-medium uppercase ${
                                                activeTab === tab ? "bg-blue-500 text-white" : "text-blue-700"
                                            }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Date display and filter */}
                                <div className="relative mb-4">
                                    {activeTab === "month" ? (
                                        <input
                                            type="month"
                                            required
                                            value={selectedDate} // Controlled input
                                            className="w-full border border-blue-300 rounded-md px-4 py-2 text-center text-blue-700 focus:outline-none mb-4"
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type="number"
                                            required
                                            min="1900"
                                            max="2100"
                                            value={parseInt(selectedDate.split("-")[0]) || new Date().getFullYear()} // Controlled input
                                            className="w-full border border-blue-300 rounded-md px-4 py-2 text-center text-blue-700 focus:outline-none mb-4"
                                            onChange={(e) => setSelectedDate(`${e.target.value}-01`)} // Update `selectedDate` with a valid year
                                        />
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setShowDatePicker(!showDatePicker);
                                        setFilter(!filter);
                                        if (activeTab === "month") {
                                            setShowDateData(new Date(selectedDate).toLocaleString("my-MM", {
                                                month: "long",
                                                year: "numeric",
                                            }));
                                        } else if (activeTab === "year") {
                                            setShowDateData(selectedDate.split("-")[0]);
                                        }
                                    }}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                                >
                                    Filter
                                </button>
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
                    <h2 className="text-lg font-semibold text-gray-700 text-center my-4">
                        {showDateData} အတွက် စာရင်း
                    </h2>
                    {incomeChartData.labels.length === 0 || (
                        <div className="w-full px-6 mt-6">
                            <Doughnut data={incomeChartData} options={chartOptions} />
                            <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                                ၀င်ငွေပြ Chart
                            </h2>
                        </div>
                    )}

                    {expenseChartData.labels.length === 0 || (
                        <div className="w-full px-6 mt-6">
                            <Doughnut data={expenseChartData} options={chartOptions} />
                            <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
                                ထွက်ငွေပြ Chart
                            </h2>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
