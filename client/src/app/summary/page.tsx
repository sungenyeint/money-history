"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { HiChevronLeft, HiDocumentDownload } from "react-icons/hi";
import { FaDownload, FaFilter } from "react-icons/fa";
import registerMyanmarFont from "../NotoSansMyanmar-Regular.js"; // Adjust the path as necessary

export default function SummaryPage() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        // Fetch transaction data
        axios
            .get("http://localhost:5000/api/transactions")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            })
            .catch((error) => console.error("Error fetching transaction data:", error));
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

    const totalAmount = filteredTransactions.reduce((sum, transaction) => {
        return sum + (transaction.type === "income" ? transaction.amount : -transaction.amount);
    }, 0);

    const handleDownloadPDF = async () => {
        const jsPDF = (await import("jspdf")).default;

        // Register the Myanmar font
        registerMyanmarFont();

        // Create document
        const doc = new jsPDF();

        doc.setFont("NotoSansMyanmar", "normal");
        doc.setFontSize(14);
        doc.text(`${new Date(filterYear, filterMonth - 1).toLocaleDateString("my-MM", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })} for transactions Summary`, 10, 15);
        doc.setFontSize(10);
        doc.text(`Download Date: ${new Date().toLocaleDateString()}`, 10, 25);

        // Table Header
        let y = 40;
        doc.setFontSize(11);
        doc.text("Date", 10, y);
        doc.text("type", 40, y);
        doc.text("Category", 80, y);
        doc.text("Amount", 150, y, { align: "right" });

        y += 6;
        doc.setLineWidth(0.1);
        doc.line(10, y, 200, y); // underline

        y += 6;

        // Transactions Table
        filteredTransactions.forEach((tx) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }

            doc.text(new Date(tx.date).toLocaleDateString(), 10, y);
            doc.text(tx.type === "income" ? "Income" : "Expense", 40, y);
            doc.text(tx.category?.name || "အမည်မသိ", 80, y);

            doc.text(
                `${tx.type === "income" ? "+ " : "- "}${Number(tx.amount).toLocaleString()}`,
                150,
                y,
                { align: "right" }
            );
            y += 8;
        });

        doc.line(10, y, 200, y); // underline
        y += 6;
        doc.text(`Total Amount: ${totalAmount >= 0 ? "+ " : "- "}${Math.abs(totalAmount).toLocaleString()} MMK`, 150, y, { align: "right" });

        // Save PDF
        doc.save(`transactions_${filterYear}_${filterMonth}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-blue-600 text-white shadow-md">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-white text-2xl">
                        <HiChevronLeft />
                    </Link>

                    <h1 className="text-lg font-semibold">Income & Expense Charts</h1>

                    <div className="relative">
                        <FaFilter className="text-xl cursor-pointer" onClick={()=> setShowDatePicker(!showDatePicker)}
                            />

                            {showDatePicker && (
                            <div className="absolute right-0 mt-2 w-72 rounded-md bg-white p-4 shadow-lg z-20 text-black">
                                <div className="space-y-4">
                                    {/* Year Selector */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Year</label>
                                        <select value={filterYear} onChange={(e)=> setFilterYear(Number(e.target.value))}
                                            className="w-full rounded border-gray-300 text-sm p-2 focus:ring-blue-500
                                            focus:border-blue-500"
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
                                        <label className="block text-sm font-medium mb-1">Month</label>
                                        <select value={filterMonth} onChange={(e)=> setFilterMonth(Number(e.target.value))}
                                            className="w-full rounded border-gray-300 text-sm p-2 focus:ring-blue-500
                                            focus:border-blue-500"
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

            {/* Transactions Table */}
            <div className="w-full px-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">
                        {new Date(filterYear, filterMonth - 1).toLocaleString("default", { month: "long" })} {filterYear}
                    </h2>
                    <FaDownload
                      title="Download PDF"
                      className="text-xl text-blue-500 cursor-pointer"
                      onClick={handleDownloadPDF}
                    />
                </div>
                {filteredTransactions.length === 0 ? (
                    <p className="text-center text-gray-500">No transactions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 border-collapse">
                            <thead className="bg-gray-100 text-gray-700 text-lg font-bold">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction, index) => (
                                    <tr
                                        key={index}
                                        className={`${
                                            transaction.type === "income"
                                                ? "bg-green-50"
                                                : "bg-red-50"
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
                                                transaction.type === "income"
                                                    ? "text-green-500"
                                                    : "text-red-500"
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
                )}
            </div>

            {/* Total Amount */}
            <div className="w-full px-6 mt-6">
                <div className="flex justify-between items-center p-4 bg-blue-100 rounded-md shadow-md">
                    <p className="text-lg font-medium text-gray-800">Total Amount</p>
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
