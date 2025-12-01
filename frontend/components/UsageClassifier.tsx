"use client";

import React, { useState, ChangeEvent } from "react";

interface ClassificationResult {
  classification: "Likely Violation" | "Likely Permitted" | "Requires Review";
  reason: string;
  recommendations: string[];
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

export function UsageClassifier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const [domain, setDomain] = useState("");
  const [useType, setUseType] = useState<"commercial" | "non-commercial" | "derivative" | "educational">("non-commercial");

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

  const classifyUsage = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/classify-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rightsSchema,
          usageContext: { domain, useType },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to classify usage");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center gap-3 mb-2">
        <div className="icon-box">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Usage Classifier</h2>
      </div>

      <p className="text-zinc-400 mb-6 ml-12">
        Check if a specific usage context complies with the rights schema.
      </p>

      {/* Rights Schema Quick Config */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Rights Schema
        </h3>
        <div className="flex flex-wrap gap-2">
          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
            rightsSchema.allowCommercialUse 
              ? "bg-green-500/10 border border-green-500/30 text-green-400" 
              : "bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600"
          }`}>
            <input
              type="checkbox"
              checked={rightsSchema.allowCommercialUse}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRightsSchema((prev: RightsSchema) => ({ ...prev, allowCommercialUse: e.target.checked }))}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
              rightsSchema.allowCommercialUse ? "bg-green-500" : "bg-zinc-700"
            }`}>
              {rightsSchema.allowCommercialUse && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">Commercial Use</span>
          </label>
          
          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
            rightsSchema.allowDerivatives 
              ? "bg-green-500/10 border border-green-500/30 text-green-400" 
              : "bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600"
          }`}>
            <input
              type="checkbox"
              checked={rightsSchema.allowDerivatives}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRightsSchema((prev: RightsSchema) => ({ ...prev, allowDerivatives: e.target.checked }))}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
              rightsSchema.allowDerivatives ? "bg-green-500" : "bg-zinc-700"
            }`}>
              {rightsSchema.allowDerivatives && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">Derivatives</span>
          </label>
          
          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
            rightsSchema.attributionRequired 
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" 
              : "bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-zinc-600"
          }`}>
            <input
              type="checkbox"
              checked={rightsSchema.attributionRequired}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRightsSchema((prev: RightsSchema) => ({ ...prev, attributionRequired: e.target.checked }))}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
              rightsSchema.attributionRequired ? "bg-amber-500" : "bg-zinc-700"
            }`}>
              {rightsSchema.attributionRequired && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">Attribution Required</span>
          </label>
        </div>
      </div>

      {/* Usage Context */}
      <div className="space-y-5 mb-6">
        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Domain / Platform
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
            placeholder="e.g., shopify.com, mywebsite.com"
            className="input"
          />
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Use Type
          </label>
          <select
            value={useType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setUseType(e.target.value as "commercial" | "non-commercial" | "derivative" | "educational")}
            className="input"
          >
            <option value="commercial">💰 Commercial</option>
            <option value="non-commercial">🎨 Non-Commercial</option>
            <option value="derivative">🔄 Derivative Work</option>
            <option value="educational">📚 Educational</option>
          </select>
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
        onClick={classifyUsage}
        disabled={loading || !domain.trim()}
        className="btn-primary w-full mb-4 group"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Classifying...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Classify Usage
          </span>
        )}
      </button>

      {result && (
        <div className={`p-5 rounded-xl border-2 ${
          result.classification === "Likely Permitted"
            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30"
            : result.classification === "Likely Violation"
            ? "bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/30"
            : "bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30"
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              result.classification === "Likely Permitted"
                ? "bg-green-500/20"
                : result.classification === "Likely Violation"
                ? "bg-red-500/20"
                : "bg-amber-500/20"
            }`}>
              {result.classification === "Likely Permitted" ? (
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : result.classification === "Likely Violation" ? (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <h3 className={`text-lg font-semibold ${
              result.classification === "Likely Permitted" ? "text-green-400" :
              result.classification === "Likely Violation" ? "text-red-400" : "text-amber-400"
            }`}>
              {result.classification}
            </h3>
          </div>
          <p className="text-sm text-zinc-300 mb-4 pl-13">{result.reason}</p>
          
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Recommendations
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="text-primary-500 mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}