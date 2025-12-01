"use client";

import { SubPageLayout } from "@/components/SubPageLayout";

export default function ResourcesPage() {
  return (
    <SubPageLayout>
      <div className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Resources</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to master on-chain IP management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-video bg-white/5 rounded-xl mb-4 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#1a1a1a]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-2">
              <span>GUIDE</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">5 MIN READ</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Getting Started with IP Registration</h3>
            <p className="text-gray-400 text-sm">Learn how to register your first intellectual property asset on Story Protocol using Stellark.</p>
          </div>

          {/* Article 2 */}
          <div className="group cursor-pointer">
            <div className="aspect-video bg-white/5 rounded-xl mb-4 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#1a1a1a]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400 font-medium mb-2">
              <span>CASE STUDY</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">3 MIN READ</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">How ArtistXYZ Protected Their Portfolio</h3>
            <p className="text-gray-400 text-sm">See how a digital artist used Stellark to secure rights for over 100 artworks.</p>
          </div>

          {/* Article 3 */}
          <div className="group cursor-pointer">
            <div className="aspect-video bg-white/5 rounded-xl mb-4 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#1a1a1a]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-2">
              <span>DEEP DIVE</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">10 MIN READ</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Understanding Programmable IP</h3>
            <p className="text-gray-400 text-sm">A technical deep dive into how Story Protocol enables programmable intellectual property.</p>
          </div>
        </div>

        <div className="mt-24 p-8 rounded-2xl bg-[#1a1a1a] border border-white/5 text-center">
          <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
          <p className="text-gray-400 mb-8">Connect with other creators and developers building on Stellark.</p>
          <div className="flex justify-center gap-4">
            <a href="https://discord.com" className="px-6 py-3 bg-[#5865F2] text-white rounded-full hover:opacity-90 transition-opacity font-medium">Join Discord</a>
            <a href="https://twitter.com" className="px-6 py-3 bg-black border border-white/10 text-white rounded-full hover:bg-white/5 transition-colors font-medium">Follow on X</a>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
