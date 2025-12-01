"use client";

import Link from "next/link";
import { SubPageLayout } from "@/components/SubPageLayout";

export default function DocsPage() {
  return (
    <SubPageLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="font-bold text-white mb-4">Getting Started</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Introduction</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Quick Start</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Concepts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Core Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">IP Registration</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Licensing</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Royalties</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">API Reference</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">REST API</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">GraphQL</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">SDKs</Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-6">Introduction to Stellark</h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Stellark is a comprehensive platform for managing intellectual property on the Story Protocol. 
            It provides tools for creators, developers, and enterprises to register assets, define licensing terms, 
            and automate royalty payments.
          </p>

          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-12">
            <h3 className="font-bold text-blue-400 mb-2">Note on Testnet</h3>
            <p className="text-sm text-gray-300">
              Stellark is currently running on the Story Protocol Aeneid Testnet. 
              Assets registered here are for testing purposes only and do not carry legal weight.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Key Concepts</h2>
          <div className="grid gap-6 mb-12">
            <div className="p-6 bg-[#141414] border border-white/5 rounded-xl">
              <h3 className="font-bold text-white mb-2">IP Assets</h3>
              <p className="text-gray-400 text-sm">
                The fundamental unit of ownership. An IP Asset can represent any creative work, 
                from images and music to code and prose.
              </p>
            </div>
            <div className="p-6 bg-[#141414] border border-white/5 rounded-xl">
              <h3 className="font-bold text-white mb-2">Licenses</h3>
              <p className="text-gray-400 text-sm">
                Programmable terms that define how others can use your IP. 
                Stellark uses the PIL (Programmable IP License) standard.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
          <div className="flex gap-4">
            <Link href="#" className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Quick Start Guide
            </Link>
            <Link href="https://docs.story.foundation" target="_blank" className="px-6 py-3 bg-[#1a1a1a] border border-white/10 text-white rounded-lg font-medium hover:bg-white/5 transition-colors">
              Story Protocol Docs
            </Link>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
