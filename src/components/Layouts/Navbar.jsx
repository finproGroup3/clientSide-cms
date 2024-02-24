"use client"
import React from 'react';
import { usePathname } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const pathname = usePathname()

  // Check if the current route is '/login'
  const isLoginPage = pathname === '/login';

  // If it's the login page, return null to hide the Navbar
  if (isLoginPage) {
    return null;
  }

  // Otherwise, render the Navbar content
  return (
    <div className="flex justify-between my-8 items-center p-4 text-white">
      {/* Left side - Dashboard */}
      <div>
        <p className="text-slate-100">Pages / Dashboard</p>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Right side - Search input, Sign In button, logos, settings */}
      <div className="flex items-center space-x-4">

        {/* Sign In Button */}
        <div className="flex items-center pl-2">
          <Image
            src="/images/person-icon.svg"
            alt="person"
            width={24}
            height={24}
          />
          <p variant="gradient" className="cursor-pointer ml-2" onClick={() => router.push('/login')}>Sign In</p>
        </div>

        {/* Logos (Replace with your actual logo components) */}
        <Link href="/">
          <Image
            src="/images/sharp.svg"
            alt="Logo1"
            width={24}
            height={24}
            className="object-contain ml-2"
          />
        </Link>
        <Link href="/">
          <Image
            src="/images/default.svg"
            alt="Logo2"
            width={24}
            height={24}
            className="object-contain mx-2"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
