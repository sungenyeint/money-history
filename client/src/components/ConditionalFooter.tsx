"use client";

import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
    const pathname = usePathname(); // Get the current route

    // Do not render Footer on the /login page
    if (pathname === "/login") {
        return null;
    }

    return <Footer />;
}
