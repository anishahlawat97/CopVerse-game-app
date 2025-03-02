"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import Link from "next/link";

const Navbar = () => {

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-white dark:bg-black text-foreground dark:text-foreground shadow-md">
            <Link href="/" className="text-lg md:text-xl lg:text-2xl font-bold flex items-center space-x-2">
                <AnimatedShinyText className="leading-none">CopVerse</AnimatedShinyText>
            </Link>

            {/* Theme Toggler */}
            <ThemeToggle className="ml-2 md:ml-4" />
        </nav>
    );
};

export default Navbar;
