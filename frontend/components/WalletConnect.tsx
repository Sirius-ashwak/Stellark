"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(false);

  // Check for ethereum with retry (MetaMask might inject after page load)
  const checkEthereum = useCallback(() => {
    if (typeof window !== 'undefined') {
      const detected = !!(window.ethereum);
      setHasEthereum(detected);
      return detected;
    }
    return false;
  }, []);

  // Ensure component is mounted before rendering wallet-dependent UI
  useEffect(() => {
    setMounted(true);
    
    // Check immediately
    checkEthereum();
    
    // Also check after a delay (MetaMask might inject late)
    const timer1 = setTimeout(checkEthereum, 100);
    const timer2 = setTimeout(checkEthereum, 500);
    const timer3 = setTimeout(checkEthereum, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [checkEthereum]);

  // Debug: Log connectors and errors
  useEffect(() => {
    if (mounted) {
      console.log("=== Wallet Debug ===");
      console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })));
      console.log("window.ethereum exists:", hasEthereum);
      console.log("window.ethereum value:", typeof window !== 'undefined' ? window.ethereum : 'SSR');
      if (error) {
        console.error("Wallet connection error:", error.message, error);
      }
    }
  }, [connectors, error, mounted, hasEthereum]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full flex items-center gap-2 border border-white/10 opacity-50"
      >
        <span>Connect Wallet</span>
      </button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm font-medium text-white font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <span className="text-xs text-gray-500">
            {chain?.name || "Connected"}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
          title="Disconnect"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }
  
  // Get the injected connector
  const injectedConnector = connectors.find(c => c.id === 'injected');
  
  const handleConnect = async () => {
    // Re-check ethereum at click time
    const ethereumNow = typeof window !== 'undefined' && !!window.ethereum;
    console.log("Connect clicked. hasEthereum:", ethereumNow, "connectors:", connectors.length);
    
    if (!ethereumNow && !hasEthereum) {
      // No wallet detected - open MetaMask download page
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    // If we have ethereum but no connectors detected, try direct connection
    if (ethereumNow && connectors.length === 0) {
      console.log("Attempting direct ethereum connection...");
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Direct connection accounts:", accounts);
        // Reload page to let wagmi pick up the connection
        window.location.reload();
        return;
      } catch (err) {
        console.error("Direct connection error:", err);
      }
    }
    
    if (injectedConnector) {
      try {
        console.log("Connecting with injected connector...");
        connect({ connector: injectedConnector });
      } catch (err) {
        console.error("Connect error:", err);
      }
    } else if (connectors.length > 0) {
      try {
        console.log("Connecting with first connector...");
        connect({ connector: connectors[0] });
      } catch (err) {
        console.error("Connect error:", err);
      }
    }
  };

  // Show connect button (use state-based hasEthereum which updates with retries)
  const showInstallButton = !hasEthereum && connectors.length === 0;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConnect}
        disabled={isPending}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2 border border-white/10 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting...</span>
          </>
        ) : showInstallButton ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Install Wallet</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </button>
      {error && (
        <span className="text-xs text-red-400 max-w-[300px] text-right" title={error.message}>
          {error.message.includes('rejected') 
            ? 'Connection rejected by user' 
            : error.message.includes('already pending')
            ? 'Check MetaMask popup'
            : `Error: ${error.message.slice(0, 50)}`}
        </span>
      )}
    </div>
  );
}
