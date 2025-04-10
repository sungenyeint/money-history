import type { Metadata } from "next";
import "./globals.css";
import { FaHome } from "react-icons/fa";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FiMoreHorizontal } from "react-icons/fi";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                {/* Footer Navigation */}
                <div className="fixed bottom-0 w-full border-t flex justify-around items-center py-3 bg-white z-10">
                    <div className="flex flex-col items-center text-cyan-500">
                        <FaHome className="text-3xl" />
                        <span className="text-xs">Home</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <FaCircleDollarToSlot className="text-3xl" />
                        <span className="text-xs">Budget</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <FiMoreHorizontal className="text-3xl" />
                        <span className="text-xs">More</span>
                    </div>
                </div>
            </body>
        </html>
    );
}
