import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";

export default function Footer() {
    return (
        <div className="fixed bottom-0 w-full border-t flex justify-around items-center py-3 bg-white z-10">
            <Link href="/" className="flex flex-col items-center text-blue-500">
                <FaHome className="text-3xl" />
                <span className="text-xs">Home</span>
            </Link>
            <div className="flex flex-col items-center text-gray-600">
                <FaCircleDollarToSlot className="text-3xl" />
                <span className="text-xs">Budget</span>
            </div>
            <Link href="/setting" className="flex flex-col items-center text-gray-600">
                <FiSettings className="text-3xl" />
                <span className="text-xs">More</span>
            </Link>
        </div>
    );
}
