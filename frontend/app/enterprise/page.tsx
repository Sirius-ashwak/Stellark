"use client";

import Link from "next/link";
import { SubPageLayout } from "@/components/SubPageLayout";

export default function EnterprisePage() {
  return (
    <SubPageLayout>
      <div className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Enterprise IP Management Scale</h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Secure, manage, and monetize intellectual property across your entire organization. 
              Custom integrations, dedicated support, and advanced analytics.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors">Contact Sales</Link>
              <Link href="#" className="px-6 py-3 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors">View Demo</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-gray-400">Total Assets</span>
                  <span className="text-2xl font-mono font-bold">14,205</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-gray-400">Active Licenses</span>
                  <span className="text-2xl font-mono font-bold text-green-400">8,932</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Revenue (YTD)</span>
                  <span className="text-2xl font-mono font-bold text-blue-400">$4.2M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 bg-[#141414] border border-white/5 rounded-xl">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
            <p className="text-gray-400">SOC2 compliant infrastructure with multi-sig wallet support and granular permission controls.</p>
          </div>
          <div className="p-8 bg-[#141414] border border-white/5 rounded-xl">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">API Access</h3>
            <p className="text-gray-400">Full access to our REST and GraphQL APIs to integrate Stellark into your existing workflows.</p>
          </div>
          <div className="p-8 bg-[#141414] border border-white/5 rounded-xl">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Dedicated Support</h3>
            <p className="text-gray-400">24/7 priority support with a dedicated account manager and engineering assistance.</p>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
