"use client";

import Link from "next/link";
import { SubPageLayout } from "@/components/SubPageLayout";

export default function PricingPage() {
  return (
    <SubPageLayout>
      <div className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start for free, scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 bg-[#141414] border border-white/5 rounded-2xl flex flex-col">
            <h3 className="text-xl font-medium text-gray-400 mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-gray-400 mb-8 text-sm">Perfect for individual creators just starting out.</p>
            
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Up to 5 IP Assets</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Basic Licensing Terms</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Story Protocol Registration</span>
              </div>
            </div>

            <Link href="/dashboard" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-center font-medium transition-colors">Get Started</Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 bg-[#1a1a1a] border border-blue-500/30 rounded-2xl flex flex-col relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">POPULAR</div>
            <h3 className="text-xl font-medium text-blue-400 mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-gray-400 mb-8 text-sm">For professional creators and small teams.</p>
            
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Unlimited IP Assets</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Advanced Licensing Logic</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Usage Classification API</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Royalty Analytics</span>
              </div>
            </div>

            <Link href="/dashboard" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-center font-medium transition-colors">Start Free Trial</Link>
          </div>

          {/* Enterprise Tier */}
          <div className="p-8 bg-[#141414] border border-white/5 rounded-2xl flex flex-col">
            <h3 className="text-xl font-medium text-purple-400 mb-2">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <p className="text-gray-400 mb-8 text-sm">For organizations with complex needs.</p>
            
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Custom Smart Contracts</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>Dedicated Support</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>SLA & Compliance</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckIcon /> <span>White-label Options</span>
              </div>
            </div>

            <Link href="/enterprise" className="w-full py-3 bg-white text-black hover:bg-gray-100 rounded-full text-center font-medium transition-colors">Contact Sales</Link>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
