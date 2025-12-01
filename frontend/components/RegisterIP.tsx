"use client";

import React, { useState, ChangeEvent } from "react";
import { useAccount } from "wagmi";

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  mediaUrl: string;
}

interface RightsSchema {
  allowDerivatives: boolean;
  allowCommercialUse: boolean;
  attributionRequired: boolean;
  shareAlike: boolean;
  royaltyRateBps: number;
  territory: string[];
  prohibitedUses: string[];
  allowedPlatforms: string[];
}

interface RegisterResult {
  txHash: string;
  ipId: string;
  explorerUrl: string;
}

export function RegisterIP() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterResult | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    mediaUrl: "",
  });

  const [rightsSchema, setRightsSchema] = useState<RightsSchema>({
    allowDerivatives: true,
    allowCommercialUse: false,
    attributionRequired: true,
    shareAlike: false,
    royaltyRateBps: 500,
    territory: ["worldwide"],
    prohibitedUses: [],
    allowedPlatforms: [],
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: keyof RightsSchema) => {
    setRightsSchema((prev: RightsSchema) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const registerIP = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.title || !formData.description || !formData.imageUrl) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nftMetadata: {
            name: `${formData.title} - Ownership NFT`,
            description: formData.description,
            image: formData.imageUrl,
          },
          ipMetadata: {
            title: formData.title,
            description: formData.description,
            image: formData.imageUrl,
            mediaUrl: formData.mediaUrl || undefined,
            creators: [
              {
                name: "Creator",
                address: address,
                contributionPercent: 100,
              },
            ],
          },
          rightsSchema,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to register IP");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="card card-hover">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-box">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Register IP Asset</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-zinc-400 mb-2">Wallet not connected</p>
          <p className="text-sm text-zinc-500">Connect your wallet to register IP assets on Story Protocol</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-hover">
      <div className="flex items-center gap-3 mb-2">
        <div className="icon-box">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Register IP Asset</h2>
      </div>

      <p className="text-zinc-400 mb-6 ml-12">
        Register your intellectual property on Story Protocol and define your rights schema.
      </p>

      {/* IP Details Form */}
      <div className="space-y-5 mb-6">
        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your IP title"
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your intellectual property"
            className="textarea h-24"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image URL * <span className="text-xs text-zinc-500">(IPFS recommended)</span>
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://ipfs.io/ipfs/..."
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Media URL <span className="text-xs text-zinc-500">(optional)</span>
          </label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleInputChange}
            placeholder="URL to your media file (image, audio, video)"
            className="input"
          />
        </div>
      </div>

      {/* Rights Schema */}
      <div className="border-t border-zinc-800 pt-6 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Rights Configuration
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleToggle("allowDerivatives")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              rightsSchema.allowDerivatives
                ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${rightsSchema.allowDerivatives ? "bg-green-400" : "bg-zinc-600"}`}></div>
              <span className={`font-medium ${rightsSchema.allowDerivatives ? "text-green-400" : "text-zinc-400"}`}>Allow Derivatives</span>
            </div>
            <div className="text-xs text-zinc-500 pl-4">
              {rightsSchema.allowDerivatives ? "Others can remix your work" : "No derivative works allowed"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggle("allowCommercialUse")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              rightsSchema.allowCommercialUse
                ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${rightsSchema.allowCommercialUse ? "bg-green-400" : "bg-zinc-600"}`}></div>
              <span className={`font-medium ${rightsSchema.allowCommercialUse ? "text-green-400" : "text-zinc-400"}`}>Commercial Use</span>
            </div>
            <div className="text-xs text-zinc-500 pl-4">
              {rightsSchema.allowCommercialUse ? "For-profit use permitted" : "Non-commercial only"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggle("attributionRequired")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              rightsSchema.attributionRequired
                ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${rightsSchema.attributionRequired ? "bg-amber-400" : "bg-zinc-600"}`}></div>
              <span className={`font-medium ${rightsSchema.attributionRequired ? "text-amber-400" : "text-zinc-400"}`}>Attribution</span>
            </div>
            <div className="text-xs text-zinc-500 pl-4">
              {rightsSchema.attributionRequired ? "Credit required" : "No credit needed"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggle("shareAlike")}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              rightsSchema.shareAlike
                ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${rightsSchema.shareAlike ? "bg-amber-400" : "bg-zinc-600"}`}></div>
              <span className={`font-medium ${rightsSchema.shareAlike ? "text-amber-400" : "text-zinc-400"}`}>Share Alike</span>
            </div>
            <div className="text-xs text-zinc-500 pl-4">
              {rightsSchema.shareAlike ? "Same license required" : "Any license allowed"}
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <label className="label flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Royalty Rate
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={rightsSchema.royaltyRateBps}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRightsSchema((prev: RightsSchema) => ({
                  ...prev,
                  royaltyRateBps: parseInt(e.target.value),
                }))
              }
              className="flex-1 accent-primary-500 h-2 rounded-full"
            />
            <div className="min-w-[80px] px-3 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg text-center">
              <span className="text-lg font-bold text-primary-400">{rightsSchema.royaltyRateBps / 100}%</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Percentage of revenue from derivative works</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={registerIP}
        disabled={loading || !formData.title || !formData.description || !formData.imageUrl}
        className="btn-primary w-full group"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Registering IP Asset...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Register IP Asset
          </span>
        )}
      </button>

      {result && (
        <div className="mt-6 p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-green-400 text-lg">IP Asset Registered Successfully!</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-zinc-400">Transaction Hash</span>
              <code className="text-sm text-zinc-200 font-mono">{result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <span className="text-sm text-zinc-400">IP ID</span>
              <code className="text-sm text-zinc-200 font-mono">{result.ipId.slice(0, 10)}...{result.ipId.slice(-8)}</code>
            </div>
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 px-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Story Explorer
            </a>
          </div>
        </div>
      )}
    </div>
  );
}