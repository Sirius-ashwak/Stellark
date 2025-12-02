import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12 px-6 lg:px-8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 14l-4.8 2.5.9-5.2-3.8-3.7 5.3-.8L12 2z" fill="currentColor"/>
              <path d="M3 20Q8 17 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
              <path d="M5 22Q9 18 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
            </svg>
            <span className="text-white font-medium">Stellark</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <a href="https://aeneid.explorer.story.foundation" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Explorer</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
          
          <p className="text-sm text-gray-600">Built on Story Protocol</p>
        </div>
    </footer>
  );
}
