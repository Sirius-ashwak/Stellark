"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 12; i++) {
      nodes.push({
        x: Math.random() * canvas.width * 0.6 + canvas.width * 0.4,
        y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < canvas.width * 0.4 || node.x > canvas.width) node.vx *= -1;
        if (node.y < canvas.height * 0.1 || node.y > canvas.height * 0.9) node.vy *= -1;

        nodes.forEach((other, j) => {
          if (i !== j) {
            const dist = Math.hypot(node.x - other.x, node.y - other.y);
            if (dist < 180) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 100, 60, ${0.2 * (1 - dist / 180)})`;
              ctx.lineWidth = 1;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.arc(node.x, node.y, node.size + 5, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-semibold text-lg">Stellark</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] rounded-full px-2 py-1.5 border border-white/10">
              <div className="relative">
                <button onClick={() => setActiveDropdown(activeDropdown === 'product' ? null : 'product')} className="px-4 py-2 text-sm rounded-full transition-colors bg-white/10 text-white flex items-center gap-1">
                  Product <ChevronDownIcon />
                </button>
                {activeDropdown === 'product' && (
                  <DropdownMenu>
                    <DropdownSection title="PLATFORM OVERVIEW">
                      <DropdownItem href="#features" icon={<DocumentIcon />} title="AI License Parser" badge="AI" description="Parse any license into structured rights." />
                      <DropdownItem href="#features" icon={<ShieldIcon />} title="IP Registration" badge="ON-CHAIN" description="Register on Story Protocol." />
                      <DropdownItem href="#features" icon={<SearchIcon />} title="Usage Classifier" badge="AI" description="Check usage compliance." />
                      <DropdownItem href="#features" icon={<ChartIcon />} title="Rights Dashboard" badge="BETA" description="Track your IP portfolio." />
                    </DropdownSection>
                  </DropdownMenu>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')} className="px-4 py-2 text-sm rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-1">
                  Resources <ChevronDownIcon />
                </button>
                {activeDropdown === 'resources' && (
                  <DropdownMenu>
                    <DropdownSection title="LEARN">
                      <DropdownItem href="/docs" icon={<BookIcon />} title="Documentation" description="API reference and guides." />
                      <DropdownItem href="/resources" icon={<PlayIcon />} title="Tutorials" description="Step-by-step guides." />
                    </DropdownSection>
                  </DropdownMenu>
                )}
              </div>
              <Link href="/enterprise" className="px-4 py-2 text-sm rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/5">Enterprise</Link>
              <Link href="/customers" className="px-4 py-2 text-sm rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/5">Customers</Link>
              <Link href="/pricing" className="px-4 py-2 text-sm rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/5">Pricing</Link>
              <a href="https://docs.story.foundation" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/5">Docs</a>
            </div>

            <div className="flex items-center gap-3">
              <WalletConnect />
              <Link href="/dashboard" className="hidden sm:flex px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">Launch App</Link>
            </div>
          </div>
        </div>
      </nav>

      {activeDropdown && <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />}

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="https://aeneid.explorer.story.foundation" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-white/10 hover:border-white/20 transition-colors mb-12 group">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors tracking-wide">STORY PROTOCOL AENEID TESTNET</span>
            <ExternalLinkIcon />
          </Link>

          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-normal tracking-tight leading-[1.05] mb-8">
            On-chain IP rights<br />management
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Register, manage, and protect your intellectual property on the blockchain.<br />Powered by AI. Secured by Story Protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link href="/dashboard" className="w-full sm:w-auto px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-all">Try Stellark free</Link>
            <Link href="#features" className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/5 transition-all">Learn more</Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
            {["Story Protocol", "IPFS", "Ethereum", "Pinata", "Groq", "wagmi"].map(name => (
              <span key={name} className="text-sm font-medium tracking-wide text-gray-400">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">PLATFORM OVERVIEW</span>
            <h2 className="text-3xl md:text-5xl font-normal mb-4">Everything you need to protect your IP</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A complete suite of AI-powered tools to manage your IP lifecycle on Story Protocol.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<DocumentIcon />} title="AI License Parser" badge="AI" description="Turn any license text into structured rights schemas. Supports CC, MIT, Apache, and custom licenses." />
            <FeatureCard icon={<ShieldIcon />} title="IP Registration" badge="ON-CHAIN" description="Register your IP on Story Protocol with immutable proof and metadata stored on IPFS." />
            <FeatureCard icon={<SearchIcon />} title="Usage Classifier" badge="AI" description="Check if usage contexts comply with your rights schema. Get detailed compliance reports." />
            <FeatureCard icon={<ChartIcon />} title="Rights Dashboard" badge="BETA" description="Visualize your IP portfolio, track licensing activity, and monitor usage." />
            <FeatureCard icon={<CodeIcon />} title="API & Integrations" description="RESTful API for programmatic access. Integrate into your existing workflows." />
            <FeatureCard icon={<SparkleIcon />} title="AI Agents" badge="BETA" description="Automated agents that monitor, protect, and manage your IP rights." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">HOW IT WORKS</span>
            <h2 className="text-3xl md:text-5xl font-normal">Simple. Powerful. On-Chain.</h2>
          </div>
          <div className="space-y-0">
            <StepItem number="01" title="Connect your wallet" description="Connect MetaMask or any Web3 wallet to Story Protocol's Aeneid testnet." />
            <StepItem number="02" title="Define your rights" description="Use AI to parse existing licenses or manually configure your rights schema." />
            <StepItem number="03" title="Register on-chain" description="Your IP is registered on Story Protocol with immutable proof of ownership." />
            <StepItem number="04" title="Monitor & protect" description="Track usage, receive alerts, and take action when rights are violated." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Assets Registered" />
            <StatCard value="50K+" label="Licenses Parsed" />
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="<1s" label="Response Time" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-5xl font-normal">Loved by creators worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard quote="Stellark made it incredibly easy to register my artwork on-chain. The AI license parser saved me hours of legal work." author="Sarah Chen" role="Digital Artist" />
            <TestimonialCard quote="As a music producer, protecting my samples is crucial. Stellark gives me peace of mind with immutable proof of ownership." author="Marcus Johnson" role="Music Producer" />
            <TestimonialCard quote="The usage classifier is a game-changer. I can now verify licensing compliance in seconds instead of days." author="Elena Rodriguez" role="Content Creator" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-normal mb-6">Ready to protect your IP?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of creators taking control of their intellectual property rights on the blockchain.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-all">Try Stellark free</Link>
            <Link href="/pricing" className="w-full sm:w-auto px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/5 transition-all">View pricing</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-white font-medium">Stellark</span>
              </Link>
              <p className="text-sm text-gray-500 max-w-xs">On-chain IP rights management powered by AI and secured by Story Protocol.</p>
            </div>
            <FooterColumn title="Product" links={[{ label: "Features", href: "#features" }, { label: "Pricing", href: "/pricing" }, { label: "Dashboard", href: "/dashboard" }, { label: "API", href: "/docs" }]} />
            <FooterColumn title="Resources" links={[{ label: "Documentation", href: "/docs" }, { label: "Tutorials", href: "/resources" }, { label: "Blog", href: "/resources" }, { label: "Support", href: "/docs" }]} />
            <FooterColumn title="Company" links={[{ label: "Customers", href: "/customers" }, { label: "Enterprise", href: "/enterprise" }, { label: "About", href: "/enterprise" }, { label: "Contact", href: "/enterprise" }]} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">© 2024 Stellark. Built on Story Protocol.</p>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><TwitterIcon /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><GithubIcon /></a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><DiscordIcon /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components
function FeatureCard({ icon, title, description, badge }: { icon: React.ReactNode; title: string; description: string; badge?: string }) {
  return (
    <div className="group p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">{icon}</div>
        {badge && <span className="text-[10px] font-semibold tracking-wider text-gray-500 bg-white/5 px-2 py-1 rounded">{badge}</span>}
      </div>
      <h3 className="text-base font-medium mb-2 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-8 py-8 border-b border-white/5 last:border-0">
      <span className="text-sm font-mono text-gray-600">{number}</span>
      <div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-normal mb-2">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-white/5">
      <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div><p className="font-medium">{author}</p><p className="text-sm text-gray-500">{role}</p></div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (<li key={link.label}><Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">{link.label}</Link></li>))}
      </ul>
    </div>
  );
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="absolute top-full left-0 mt-2 w-[400px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">{children}</div>;
}

function DropdownSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-4 last:mb-0"><p className="text-xs font-semibold tracking-widest text-gray-500 mb-3">{title}</p><div className="grid grid-cols-2 gap-2">{children}</div></div>;
}

function DropdownItem({ href, icon, title, description, badge }: { href: string; icon: React.ReactNode; title: string; description: string; badge?: string }) {
  return (
    <Link href={href} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2"><p className="text-sm font-medium group-hover:text-white transition-colors">{title}</p>{badge && <span className="text-[9px] font-semibold tracking-wider text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{badge}</span>}</div>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
    </Link>
  );
}

// Icons
function ChevronDownIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>; }
function ExternalLinkIcon() { return <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>; }
function DocumentIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function ShieldIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function SearchIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function ChartIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }
function CodeIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>; }
function SparkleIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>; }
function BookIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function PlayIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function GithubIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>; }
function DiscordIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>; }
function TwitterIcon() { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>; }
