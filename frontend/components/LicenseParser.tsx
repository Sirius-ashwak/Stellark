"use client";

import React, { useState, ChangeEvent } from "react";

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

interface ParseResult {
  schema: RightsSchema;
  confidence: number;
}

export function LicenseParser() {
  const [licenseText, setLicenseText] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseLicense = async () => {
    if (!licenseText.trim()) {
      setError("Please enter license text to parse");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/parse-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseText }),
      });

      if (!res.ok) {
        throw new Error("Failed to parse license");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exampleLicenses = [
    { name: "CC-BY 4.0", icon: "📝", text: "Creative Commons Attribution 4.0 International (CC-BY 4.0). You are free to share and adapt the material for any purpose, even commercially. You must give appropriate credit." },
    { name: "CC-BY-NC-SA", icon: "🔒", text: "CC-BY-NC-SA 4.0. Attribution required. Non-commercial use only. Share alike - derivatives must use the same license." },
    { name: "All Rights Reserved", icon: "⛔", text: "All Rights Reserved. No part of this work may be reproduced, distributed, or transmitted in any form without prior written permission." },
  ];

  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="section-title mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-xl mr-3 border border-amber-500/20">
              📜
            </div>
            License Parser
          </h2>
          <p className="text-zinc-500 text-sm">AI-powered license analysis</p>
        </div>
        <span className="badge-info">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          AI Powered
        </span>
      </div>

      {/* Example buttons */}
      <div className="mb-4">
        <span className="text-xs text-zinc-500 mb-2 block">Quick examples:</span>
        <div className="flex flex-wrap gap-2">
          {exampleLicenses.map((example) => (
            <button
              key={example.name}
              onClick={() => setLicenseText(example.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-black/30 border border-border/50 rounded-lg hover:border-primary-500/30 hover:text-primary-300 hover:bg-primary-500/5 transition-all duration-200"
            >
              <span>{example.icon}</span>
              {example.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={licenseText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLicenseText(e.target.value)}
          placeholder="Paste your license text here... (e.g., CC-BY 4.0, MIT License, etc.)"
          className="textarea h-36 mb-4 text-sm"
        />
        {licenseText && (
          <button
            onClick={() => setLicenseText("")}
            className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-white rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={parseLicense}
        disabled={loading || !licenseText.trim()}
        className="btn-primary w-full mb-4"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing License...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Parse License
          </span>
        )}
      </button>

      {result && (
        <div className="border-t border-border/50 pt-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Parsed Rights Schema
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              result.confidence >= 0.9 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              result.confidence >= 0.7 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {Math.round(result.confidence * 100)}% confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-4 rounded-xl border transition-all ${result.schema.allowDerivatives ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
              <span className="text-xs font-medium text-zinc-400 block mb-1">Derivatives</span>
              <div className={`text-base font-semibold flex items-center gap-1.5 ${result.schema.allowDerivatives ? "text-emerald-400" : "text-red-400"}`}>
                {result.schema.allowDerivatives ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Allowed</>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg> Not Allowed</>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${result.schema.allowCommercialUse ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
              <span className="text-xs font-medium text-zinc-400 block mb-1">Commercial Use</span>
              <div className={`text-base font-semibold flex items-center gap-1.5 ${result.schema.allowCommercialUse ? "text-emerald-400" : "text-red-400"}`}>
                {result.schema.allowCommercialUse ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Allowed</>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg> Not Allowed</>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${result.schema.attributionRequired ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
              <span className="text-xs font-medium text-zinc-400 block mb-1">Attribution</span>
              <div className={`text-base font-semibold flex items-center gap-1.5 ${result.schema.attributionRequired ? "text-amber-400" : "text-emerald-400"}`}>
                {result.schema.attributionRequired ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> Required</>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Not Required</>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${result.schema.shareAlike ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
              <span className="text-xs font-medium text-zinc-400 block mb-1">Share Alike</span>
              <div className={`text-base font-semibold flex items-center gap-1.5 ${result.schema.shareAlike ? "text-amber-400" : "text-emerald-400"}`}>
                {result.schema.shareAlike ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> Required</>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Not Required</>
                )}
              </div>
            </div>
          </div>

          {result.schema.royaltyRateBps > 0 && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                💰
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Royalty Rate</span>
                <span className="text-lg font-bold text-blue-400">{result.schema.royaltyRateBps / 100}%</span>
              </div>
            </div>
          )}

          <details className="group/details">
            <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-2 py-2">
              <svg className="w-4 h-4 transition-transform group-open/details:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              View Raw JSON
            </summary>
            <pre className="mt-2 p-4 bg-black/40 rounded-xl overflow-auto text-xs text-zinc-400 font-mono border border-border/30">
              {JSON.stringify(result.schema, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}