"use client";

import { SubPageLayout } from "@/components/SubPageLayout";

export default function CustomersPage() {
  return (
    <SubPageLayout>
      <div className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Trusted by Visionaries</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From independent creators to global enterprises, Stellark powers the next generation of IP management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Customer 1 */}
          <div className="p-8 bg-[#141414] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="h-8 mb-6 text-white font-bold text-xl">PixelForge</div>
            <p className="text-gray-400 mb-6">"Stellark completely transformed how we handle asset licensing for our game assets. The automated royalty payments saved us hundreds of hours."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <div className="font-medium">Sarah Jenks</div>
                <div className="text-sm text-gray-500">CTO, PixelForge</div>
              </div>
            </div>
          </div>
          {/* Customer 2 */}
          <div className="p-8 bg-[#141414] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="h-8 mb-6 text-white font-bold text-xl">SoundWave</div>
            <p className="text-gray-400 mb-6">"The ability to register music stems on-chain and programmatically define remix rights is a game changer for our artists."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <div className="font-medium">Marcus Chen</div>
                <div className="text-sm text-gray-500">Founder, SoundWave</div>
              </div>
            </div>
          </div>
          {/* Customer 3 */}
          <div className="p-8 bg-[#141414] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
            <div className="h-8 mb-6 text-white font-bold text-xl">WriteChain</div>
            <p className="text-gray-400 mb-6">"We use Stellark's API to verify authorship and manage syndication rights for thousands of articles daily."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div>
                <div className="font-medium">Elena Rodriguez</div>
                <div className="text-sm text-gray-500">Product Lead, WriteChain</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
