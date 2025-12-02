"use client";

import React, { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { LicenseParser } from "@/components/LicenseParser";
import { RegisterIP } from "@/components/RegisterIP";
import { UsageClassifier } from "@/components/UsageClassifier";
import { useAccount } from "wagmi";
import Link from "next/link";

type TabType = "overview" | "parser" | "register" | "classifier";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header - Dovetail Style */}
      <header className="border-b border-white/5 bg-[#0d0d0d]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 14l-4.8 2.5.9-5.2-3.8-3.7 5.3-.8L12 2z" fill="currentColor"/>
                <path d="M3 20Q8 17 12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
                <path d="M5 22Q9 18 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
              </svg>
              <span className="text-white font-medium">Stellark</span>
            </Link>
            
            {/* Center Nav */}
            <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] rounded-full px-1.5 py-1 border border-white/5">
              <TabButton 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </TabButton>
              <TabButton 
                active={activeTab === "parser"} 
                onClick={() => setActiveTab("parser")}
              >
                License Parser
              </TabButton>
              <TabButton 
                active={activeTab === "register"} 
                onClick={() => setActiveTab("register")}
              >
                Register IP
              </TabButton>
              <TabButton 
                active={activeTab === "classifier"} 
                onClick={() => setActiveTab("classifier")}
              >
                Usage Classifier
              </TabButton>
            </div>
            
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {!isConnected ? (
          /* Connect Wallet Prompt - Dovetail Style */
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <h2 className="text-2xl font-normal text-white mb-3">Connect your wallet</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              Connect your wallet to access the dashboard and manage your IP assets on Story Protocol.
            </p>
            <WalletConnect />
          </div>
        ) : (
          <>
            {/* Mobile Tab Selector */}
            <div className="md:hidden mb-6">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="overview">Overview</option>
                <option value="parser">License Parser</option>
                <option value="register">Register IP</option>
                <option value="classifier">Usage Classifier</option>
              </select>
            </div>

            {activeTab === "overview" && (
              <>
                {/* Page Title */}
                <div className="mb-8">
                  <h1 className="text-2xl font-normal text-white mb-2">Dashboard</h1>
                  <p className="text-gray-500">Manage your intellectual property assets</p>
                </div>

                {/* Stats Grid - Dovetail Card Style */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                  <StatCard 
                    label="Total Assets" 
                    value="0" 
                    icon={<AssetsIcon />}
                  />
                  <StatCard 
                    label="Licenses Parsed" 
                    value="0" 
                    icon={<DocumentIcon />}
                  />
                  <StatCard 
                    label="Usage Checks" 
                    value="0" 
                    icon={<CheckIcon />}
                  />
                  <StatCard 
                    label="Compliance Rate" 
                    value="--" 
                    icon={<ChartIcon />}
                  />
                </div>

                {/* Tools Grid */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToolCard
                      title="Parse License"
                      description="Upload any license text and extract structured rights using AI."
                      icon={<DocumentIcon />}
                      onClick={() => setActiveTab("parser")}
                    />
                    <ToolCard
                      title="Register IP"
                      description="Register your IP asset on Story Protocol with full metadata."
                      icon={<ShieldIcon />}
                      onClick={() => setActiveTab("register")}
                    />
                    <ToolCard
                      title="Check Usage"
                      description="Verify if a specific usage context complies with your rights."
                      icon={<SearchIcon />}
                      onClick={() => setActiveTab("classifier")}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
                  <div className="bg-[#141414] border border-white/5 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-600 mt-1">Your actions will appear here</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "parser" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-normal text-white mb-2">License Parser</h1>
                  <p className="text-gray-500">Extract structured rights from any license text using AI</p>
                </div>
                <LicenseParser />
              </div>
            )}

            {activeTab === "register" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-normal text-white mb-2">Register IP</h1>
                  <p className="text-gray-500">Register your intellectual property on Story Protocol</p>
                </div>
                <RegisterIP />
              </div>
            )}

            {activeTab === "classifier" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-normal text-white mb-2">Usage Classifier</h1>
                  <p className="text-gray-500">Check if specific usage contexts comply with your rights</p>
                </div>
                <UsageClassifier />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Tab Button Component
function TabButton({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
        active 
          ? "bg-white/10 text-white" 
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-medium text-white">{value}</p>
    </div>
  );
}

// Tool Card Component
function ToolCard({ 
  title, 
  description, 
  icon, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group p-6 bg-[#141414] border border-white/5 rounded-xl text-left hover:border-white/10 hover:bg-[#1a1a1a] transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white mb-4 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      <div className="flex items-center gap-1 mt-4 text-sm text-gray-500 group-hover:text-white transition-colors">
        <span>Get started</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// Icons
function AssetsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
