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
                <li><a href="#introduction" className="hover:text-white transition-colors">Introduction</a></li>
                <li><a href="#quick-start" className="hover:text-white transition-colors">Quick Start</a></li>
                <li><a href="#concepts" className="hover:text-white transition-colors">Key Concepts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Core Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#license-parser" className="hover:text-white transition-colors">License Parser</a></li>
                <li><a href="#ip-registration" className="hover:text-white transition-colors">IP Registration</a></li>
                <li><a href="#usage-classifier" className="hover:text-white transition-colors">Usage Classifier</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">API Reference</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#api-parse" className="hover:text-white transition-colors">POST /api/parse-license</a></li>
                <li><a href="#api-register" className="hover:text-white transition-colors">POST /api/register-ip</a></li>
                <li><a href="#api-classify" className="hover:text-white transition-colors">POST /api/classify-usage</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#tutorials" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="https://github.com/Sirius-ashwak/Stellark" target="_blank" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://docs.story.foundation" target="_blank" className="hover:text-white transition-colors">Story Protocol</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow max-w-3xl">
          <section id="introduction">
            <h1 className="text-4xl font-bold mb-6">Introduction to Stellark</h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Stellark is a comprehensive platform for managing intellectual property on Story Protocol. 
              Parse licenses with AI, register IP on-chain, and verify usage compliance programmatically.
            </p>

            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-12">
              <h3 className="font-bold text-blue-400 mb-2">Testnet Notice</h3>
              <p className="text-sm text-gray-300">
                Stellark runs on Story Protocol Aeneid Testnet. Get testnet tokens from the{" "}
                <a href="https://docs.story.foundation/network/network-info/aeneid#faucet" target="_blank" className="text-blue-400 hover:underline">Story Faucet</a>.
              </p>
            </div>
          </section>

          <section id="quick-start" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
                <p className="text-gray-500 mb-2"># Clone the repository</p>
                <p className="text-green-400">git clone https://github.com/Sirius-ashwak/Stellark.git</p>
                <p className="text-green-400">cd Stellark</p>
              </div>
              <div className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
                <p className="text-gray-500 mb-2"># Install and run backend</p>
                <p className="text-green-400">cd backend && npm install</p>
                <p className="text-green-400">cp .env.example .env</p>
                <p className="text-green-400">npx prisma generate && npx prisma db push</p>
                <p className="text-green-400">npm run dev</p>
              </div>
              <div className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
                <p className="text-gray-500 mb-2"># Install and run frontend</p>
                <p className="text-green-400">cd frontend && npm install</p>
                <p className="text-green-400">npm run dev</p>
              </div>
            </div>
          </section>

          <section id="concepts" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Key Concepts</h2>
            <div className="grid gap-4">
              <div className="p-6 bg-[#141414] border border-white/5 rounded-xl">
                <h3 className="font-bold text-white mb-2">Rights Schema</h3>
                <p className="text-gray-400 text-sm mb-4">
                  A structured representation of IP rights including commercial use, derivatives, attribution, and royalties.
                </p>
                <pre className="text-xs bg-black/50 p-3 rounded-lg overflow-x-auto text-gray-300">
{`{
  "allowDerivatives": true,
  "allowCommercialUse": false,
  "attributionRequired": true,
  "royaltyRateBps": 500
}`}
                </pre>
              </div>
              <div className="p-6 bg-[#141414] border border-white/5 rounded-xl">
                <h3 className="font-bold text-white mb-2">IP Assets</h3>
                <p className="text-gray-400 text-sm">
                  On-chain representations of intellectual property registered on Story Protocol with metadata stored on IPFS.
                </p>
              </div>
            </div>
          </section>

          <section id="license-parser" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">License Parser</h2>
            <p className="text-gray-400 mb-6">
              Use AI to parse any license text (CC-BY, MIT, Apache, custom) into a structured Rights Schema.
            </p>
            <div id="api-parse" className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
              <p className="text-purple-400 mb-2">POST /api/parse-license</p>
              <pre className="text-xs text-gray-300">
{`// Request
{ "licenseText": "CC-BY 4.0 Attribution required..." }

// Response
{
  "schema": {
    "allowDerivatives": true,
    "allowCommercialUse": true,
    "attributionRequired": true
  },
  "confidence": 0.95
}`}
              </pre>
            </div>
          </section>

          <section id="ip-registration" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">IP Registration</h2>
            <p className="text-gray-400 mb-6">
              Register IP assets on Story Protocol with NFT minting and IPFS metadata storage.
            </p>
            <div id="api-register" className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
              <p className="text-purple-400 mb-2">POST /api/register-ip</p>
              <pre className="text-xs text-gray-300">
{`// Request
{
  "nftMetadata": { "name": "...", "description": "..." },
  "ipMetadata": { "title": "...", "image": "..." },
  "rightsSchema": { ... }
}

// Response
{
  "txHash": "0x...",
  "ipId": "0x...",
  "explorerUrl": "https://aeneid.explorer..."
}`}
              </pre>
            </div>
          </section>

          <section id="usage-classifier" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Usage Classifier</h2>
            <p className="text-gray-400 mb-6">
              Verify if a usage context complies with a given Rights Schema.
            </p>
            <div id="api-classify" className="p-4 bg-[#141414] border border-white/5 rounded-xl font-mono text-sm">
              <p className="text-purple-400 mb-2">POST /api/classify-usage</p>
              <pre className="text-xs text-gray-300">
{`// Request
{
  "rightsSchema": { ... },
  "usageContext": { "domain": "shopify.com", "useType": "commercial" }
}

// Response
{
  "classification": "Likely Violation",
  "reason": "Commercial use not allowed"
}`}
              </pre>
            </div>
          </section>

          <section id="tutorials" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Tutorials & Guides</h2>
            <div className="grid gap-6">
              <a href="#" className="group p-6 bg-[#141414] border border-white/5 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-2">
                  <span>GUIDE</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">5 MIN</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">Getting Started with IP Registration</h3>
                <p className="text-gray-400 text-sm">Register your first IP asset on Story Protocol using Stellark.</p>
              </a>
              <a href="#" className="group p-6 bg-[#141414] border border-white/5 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-2">
                  <span>DEEP DIVE</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">10 MIN</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">Understanding Programmable IP</h3>
                <p className="text-gray-400 text-sm">Technical deep dive into Story Protocol and programmable IP rights.</p>
              </a>
              <a href="#" className="group p-6 bg-[#141414] border border-white/5 rounded-xl hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs text-green-400 font-medium mb-2">
                  <span>TUTORIAL</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">7 MIN</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">Parsing Custom License Terms</h3>
                <p className="text-gray-400 text-sm">Use the AI License Parser to convert custom legal terms into structured rights.</p>
              </a>
            </div>
          </section>
          
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Launch Dashboard
            </Link>
            <a href="https://github.com/Sirius-ashwak/Stellark" target="_blank" className="px-6 py-3 bg-[#1a1a1a] border border-white/10 text-white rounded-lg font-medium hover:bg-white/5 transition-colors">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
