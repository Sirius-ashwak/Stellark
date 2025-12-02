"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
      if (path === "/") {
          return pathname === "/";
      }
      return pathname.startsWith(path);
  };

  return (
    <nav className="z-50 py-4 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
             {/* Logo */}
             <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 14l-4.8 2.5.9-5.2-3.8-3.7 5.3-.8L12 2z" fill="currentColor"/>
                  <path d="M3 20Q8 17 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
                  <path d="M5 22Q9 18 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
                </svg>
                <span className="font-bold text-xl hidden sm:block">Stellark</span>
             </Link>

             {/* Center Nav */}
             <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] rounded-full px-2 py-1.5 border border-white/10">
                <NavLink href="/" active={pathname === "/"}>Product</NavLink>
                <NavLink href="/resources" active={isActive('/resources')}>Resources</NavLink>
                <NavLink href="/enterprise" active={isActive('/enterprise')}>Enterprise</NavLink>
                <NavLink href="/customers" active={isActive('/customers')}>Customers</NavLink>
                <NavLink href="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
                <NavLink href="/docs" active={isActive('/docs')}>Docs</NavLink>
             </div>

             {/* Right Nav */}
             <div className="flex items-center gap-3">
                <WalletConnect />
                <Link 
                  href="/dashboard" 
                  className="hidden sm:flex px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Launch App
                </Link>
             </div>
          </div>
       </div>
    </nav>
  );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`px-4 py-2 text-sm rounded-full transition-colors ${
        active 
          ? "bg-white/10 text-white" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
