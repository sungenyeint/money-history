import Link from "next/link";

export default function Income() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-cyan-400 text-white text-center py-4 relative">
                <Link href="/" className="absolute left-4 top-4 text-white text-xl">←</Link>
                <h1 className="text-lg font-semibold">၀င်ငွေရေးသွင်း</h1>
            </div>

            {/* Category label */}
            <div className="mt-4 w-full px-6 text-gray-700 font-medium text-base">
                အမျိုးအစားရွေးပါ
            </div>

            {/* Categories grid */}
            <div className="mt-4 px-6 w-full">
                <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                    {[
                        { label: 'ဖုန်းဘေလ်', color: 'bg-green-500', icon: '📱' },
                        { label: 'ကားခ', color: 'bg-yellow-500', icon: '🚌' },
                        { label: 'အစားအစာ', color: 'bg-orange-500', icon: '🍛' },
                        { label: 'အင်တာနက်', color: 'bg-green-500', icon: '🌐' },
                        { label: 'သန့်ရှင်း', color: 'bg-orange-300', icon: '🧼' },
                        { label: 'အားကစား', color: 'bg-gray-600', icon: '🏋️' },
                        { label: 'ဖုန်းဘေလ်', color: 'bg-green-500', icon: '📱' },
                        { label: 'ကားခ', color: 'bg-yellow-500', icon: '🚌' },
                        { label: 'အစားအစာ', color: 'bg-orange-500', icon: '🍛' },
                        { label: 'အင်တာနက်', color: 'bg-green-500', icon: '🌐' },
                        { label: 'သန့်ရှင်း', color: 'bg-orange-300', icon: '🧼' },
                        { label: 'အားကစား', color: 'bg-gray-600', icon: '🏋️' },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-sm text-gray-700">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${item.color}`}>
                                {item.icon}
                            </div>
                            <span className="mt-2 text-center">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amount Section */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">ပမာဏ</label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full mt-2 p-2 rounded-md bg-cyan-50 text-cyan-700 text-center"
                />
            </div>

            {/* Notes Section */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">မှတ်စု</label>
                <textarea
                    placeholder="Enter Notes"
                    rows={4}
                    className="w-full mt-2 p-2 rounded-md bg-cyan-50 text-cyan-700 text-center">
                </textarea>
            </div>

            {/* Date Picker */}
            <div className="w-full px-6 mt-6">
                <label className="text-gray-700 font-medium">နေ့ ရက်</label>
                <input
                    type="date"
                    className="w-full mt-2 p-2 rounded-md bg-cyan-50 text-cyan-700 text-center"
                />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 w-full px-6 space-y-3">
                <button className="w-full bg-cyan-400 text-white py-3 rounded-full font-semibold">
                    အတည်ပြုမည်
                </button>
                <button className="w-full border border-cyan-400 text-cyan-400 py-3 rounded-full font-semibold">
                    ပယ်ဖျက်မည်
                </button>
            </div>

            {/* Footer Navigation */}
            <div className="mt-auto w-full border-t flex justify-around items-center py-3">
                <div className="flex flex-col items-center text-cyan-500">
                    <span className="text-xl">🏠</span>
                    <span className="text-xs">Home</span>
                </div>
                <div className="flex flex-col items-center text-gray-600">
                    <span className="text-xl">💰</span>
                    <span className="text-xs">Budget</span>
                </div>
                <div className="flex flex-col items-center text-gray-600">
                    <span className="text-xl">⋯</span>
                    <span className="text-xs">More</span>
                </div>
            </div>
        </div>
    );
}
