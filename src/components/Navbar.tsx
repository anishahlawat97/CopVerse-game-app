'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-white dark:bg-black text-foreground dark:text-foreground shadow-md">
      <Link
        href="/"
        className="text-lg md:text-xl lg:text-2xl font-bold flex items-center space-x-2"
      >
        <Image
          src="/copverse-logo-2.png"
          alt="CopVerse Logo"
          width={240}
          height={240}
          className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
          priority
        />
      </Link>

      {/* Theme Toggler */}
      <ThemeToggle className="ml-2 md:ml-4" />
    </nav>
  )
}

export default Navbar
