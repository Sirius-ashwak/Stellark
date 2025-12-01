import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12 px-6 lg:px-8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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
