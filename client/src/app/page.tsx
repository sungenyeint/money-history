import Link from "next/link"

const res = await fetch('http://localhost:5000/api');
    const data = await res.json();
    console.log(data);
export default function Home() {
    return (
        <div className="min-h-screen bg-cyan-400 text-white flex flex-col">
            {/* Header */}
            <div className="text-center py-8">
                <h1 className="text-xl font-semibold mb-1">လက်ရှိပိုက်ဆံ</h1>
                <p className="text-4xl font-bold">-250,000</p>
                <p className="text-sm">MMK</p>
            </div>

            {/* Summary Cards */}
            <div className="bg-white rounded-t-3xl p-6 flex flex-col gap-6 text-black">
                <div className="flex justify-around">
                    <Link href="/income">
                        <div className="bg-cyan-200 rounded-xl shadow-md p-4 w-36 text-center">
                            <div className="text-green-500 text-3xl">⬆️</div>
                            <p className="mt-2 text-sm">ဝင်ငွေ</p>
                            <p className="font-semibold text-green-600">0</p>
                        </div>
                    </Link>
                    <Link href="/expense">
                        <div className="bg-cyan-200 rounded-xl shadow-md p-4 w-36 text-center">
                            <div className="text-red-500 text-3xl">⬇️</div>
                            <p className="mt-2 text-sm">ထွက်ငွေ</p>
                            <p className="font-semibold text-red-600">250,000</p>
                        </div>
                    </Link>
                </div>

                {/* Buttons */}
                <div className="flex justify-around rounded-xl p-4">
                    <button className="bg-cyan-400 text-white rounded-full w-36 px-4 py-2 text-sm">စာရင်းပြ Chart</button>
                    <button className="bg-cyan-400 text-white rounded-full w-36 px-4 py-2 text-sm">စာရင်းချုပ်</button>
                </div>

                {/* Transaction List */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm mb-1">Apr 07, 2025</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-purple-500 text-2xl">💲</span>
                                <span>အကြွေး</span>
                            </div>
                            <div className="text-red-500">-50,000 MMK</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No notes available.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm mb-1">Apr 06, 2025</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 text-2xl">🍽️</span>
                                <span>အလွှာ</span>
                            </div>
                            <div className="text-red-500">-90,000 MMK</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No notes available.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm mb-1">Apr 06, 2025</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-purple-500 text-2xl">🛍️</span>
                                <span>ဝယ်စျေး</span>
                            </div>
                            <div className="text-red-500">-30,000 MMK</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">No notes available.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-3 text-gray-700">
                <div className="flex flex-col items-center text-cyan-400">
                    <span className="text-2xl">🏠</span>
                    <span className="text-xs">Home</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl">💰</span>
                    <span className="text-xs">Budget</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl">⋯</span>
                    <span className="text-xs">More</span>
                </div>
            </div>
        </div>
    );
}
