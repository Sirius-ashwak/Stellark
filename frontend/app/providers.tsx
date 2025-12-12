"use client";

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

// Story Aeneid Testnet chain configuration
const storyAeneid = {
  id: 1315,
  name: "Story Aeneid Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: { http: ["https://aeneid.storyrpc.io"] },
  },
  blockExplorers: {
    default: { name: "Story Explorer", url: "https://aeneid.explorer.story.foundation" },
  },
  testnet: true,
} as const;

// Create config function to ensure it's only created on the client
function getConfig() {
  return createConfig({
    chains: [storyAeneid, sepolia, mainnet],
    connectors: [
      injected({
        shimDisconnect: true,
      }),
    ],
    transports: {
      [storyAeneid.id]: http(),
      [sepolia.id]: http(),
      [mainnet.id]: http(),
    },
    ssr: true, // Enable SSR support
  });
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [config] = useState(() => getConfig());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted ? children : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
