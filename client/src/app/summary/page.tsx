"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { FaDownload } from "react-icons/fa";
import { LiaFilterSolid } from "react-icons/lia";
import registerMyanmarFont from "../NotoSansMyanmar-Regular.js"; // Adjust the path as necessary
import apiClient from "@/utils/apiMiddleware";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
    id: string;
    amount: number;
    date: string;
    type: string;
    category: {
        name: string;
    };
}

export default function SummaryPage() {
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
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

    const totalAmount = filteredTransactions.reduce((sum, transaction) => {
        return sum + (transaction.type === "income" ? transaction.amount : -transaction.amount);
    }, 0);

    const changeTabHandler = (tab: string) => () => {
        setActiveTab(tab);
        if (tab === "month") {
            setSelectedDate(new Date().toISOString().split("T")[0].slice(0, 7)); // Reset selected date to current month
        } else if (tab === "year") {
            setSelectedDate(`${new Date().getFullYear()}-01`); // Reset selected date to current year
        }
    };

    const handleDownloadPDF = async () => {
        const jsPDF = (await import("jspdf")).default;

        // Register the Myanmar font
        registerMyanmarFont();

        // Create document
        const doc = new jsPDF();

        doc.setFont("helvetica");
        doc.setFontSize(14);
        if (activeTab === "month") {
            doc.text(`Monthly Report [ ${new Date(selectedDate).toLocaleString("en-US", { month: "long", year: "numeric" })} ]`, 10, 15);
        } else if (activeTab === "year") {
            doc.text(`Yearly Report [ ${selectedDate.split("-")[0]} ]`, 10, 15);
        }
        doc.setFontSize(10);
        doc.text(`Download Date: ${new Date().toLocaleDateString()}`, 10, 25);

        // Table Header
        let y = 40;
        doc.setFontSize(12);
        doc.setFillColor(233, 233, 233); // Brown background color
        doc.rect(8, y -6 , 120, 10, "F"); // Draw filled rectangle for header background
        doc.text("Date", 10, y);
        doc.text("Category", 50, y);
        doc.text("Amount", 120, y, { align: "right" });

        y += 6;
        doc.setLineWidth(0.1);
        // doc.line(10, y, 130, y); // underline

        y += 6;

        // Transactions Table
        filteredTransactions.forEach((tx) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }

            doc.text(new Date(tx.date).toLocaleDateString(), 10, y);
            doc.setFont("NotoSansMyanmar", "normal");
            doc.text(tx.category?.name || "အမည်မသိ", 50, y);
            doc.setFont("helvetica");
            doc.setTextColor(tx.type === "income" ? 0 : 255, tx.type === "income" ? 128 : 0, 0); // Green for income, Red for expense
            doc.text(
                `${tx.type === "income" ? "+ " : "- "}${Number(tx.amount).toLocaleString()}`,
                120,
                y,
                { align: "right" }
            );
            doc.setTextColor(0, 0, 0); // Reset to black
            y += 8;
            doc.line(10, y - 5, 130, y - 5); // underline
        });

        // doc.line(10, y, 130, y); // underline
        y += 6;
        doc.setFillColor(233, 233, 233); // Brown background color
        doc.rect(8, y -6 , 120, 10, "F");
        doc.text(
            `Total Amount: ${totalAmount >= 0 ? "+ " : "- "}${Math.abs(totalAmount).toLocaleString()} MMK`,
            120,
            y,
            { align: "right" }
        );

        // Save PDF
        doc.save(`transactions_${selectedDate}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-blue-600 text-white shadow-md">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-white text-2xl">
                        <HiChevronLeft />
                    </Link>

                    <h1 className="text-lg font-semibold">စာရင်းချုပ်</h1>

                    <div className="relative">
                        <LiaFilterSolid
                            className="text-xl cursor-pointer size-6 text-white"
                            onClick={() => setShowDatePicker(!showDatePicker)}
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
                                            setShowDateData(new Date(selectedDate).toLocaleString("en-US", {
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

            {/* Transactions Table */}
            <div className="w-full px-6 mt-6">
                {filteredTransactions.length === 0 ? (
                    <div className="flex items-center justify-center h-screen text-gray-500">
                        <p>စာရင်းမရှိပါ။</p>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">
                                {showDateData} စာရင်းချုပ်
                            </h2>
                            <FaDownload
                                title="Download PDF"
                                className="text-xl text-blue-500 cursor-pointer"
                                onClick={handleDownloadPDF}
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 border-collapse">
                                <thead className="bg-gray-100 text-gray-700 text-lg font-bold">
                                    <tr>
                                        <th className="px-4 py-2">နေ့ ရက်</th>
                                        <th className="px-4 py-2">အမျိုးအစား</th>
                                        <th className="px-4 py-2">ပမာဏ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className={`${
                                                transaction.type === "income" ? "bg-green-50" : "bg-red-50"
                                            }`}
                                        >
                                            <td className="px-4 py-2">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {transaction.category?.name || "Unknown Category"}
                                            </td>
                                            <td
                                                className={`px-4 py-2 font-semibold text-right ${
                                                    transaction.type === "income" ? "text-green-500" : "text-red-500"
                                                }`}
                                            >
                                                {transaction.type === "income" ? "+ " : "- "}
                                                {Number(transaction.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Total Amount */}
            <div className="w-full px-6 mt-6">
                <div className="flex justify-between items-center p-4 bg-blue-100 rounded-md shadow-md">
                    <p className="text-lg font-medium text-gray-800">စုစုပေါင်း</p>
                    <p
                        className={`text-lg font-semibold ${
                            totalAmount >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {totalAmount >= 0 ? "+ " : "- "}
                        {Math.abs(totalAmount).toLocaleString()} MMK
                    </p>
                </div>
            </div>
        </div>
    );
}
