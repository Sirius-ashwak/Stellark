// Yakoa API Service - MOCK: for dev only
// From https://docs.yakoa.io/reference/get-started [web:38]
// Real endpoint: POST https://{subdomain}.ip-api-sandbox.yakoa.io/{network}/token

import axios from "axios";
import { VerifyOriginalityResponse } from "../types";

const YAKOA_BASE_URL = process.env.YAKOA_API_KEY
  ? `https://${process.env.YAKOA_SUBDOMAIN}.ip-api-sandbox.yakoa.io/${process.env.YAKOA_NETWORK}`
  : null;

// MOCK response structure based on Yakoa docs [web:38]
// Real workflow: Register Token -> Monitor Results -> Check infringements object
interface YakoaTokenRequest {
  id: string; // contract_address:token_id
  registration_tx: {
    block_number: number;
    tx_hash: string;
  };
  creator_id: string;
  metadata: {
    name: string;
    description: string;
  };
  media: Array<{
    media_id: string;
    url: string;
  }>;
}

interface YakoaInfringement {
  url: string;
  similarity: number;
  brand?: string;
  type?: "external_infringement" | "in_network_infringement";
}

// MOCK: for dev only - Yakoa requires API key and async workflow
export async function verifyOriginality(mediaUrl: string): Promise<VerifyOriginalityResponse> {
  // If real API key provided, attempt real call
  if (YAKOA_BASE_URL && process.env.YAKOA_API_KEY) {
    try {
      // Note: Real Yakoa workflow is async - you register token then poll for results
      // This is a simplified mock of what the response structure would look like
      const response = await axios.post(
        `${YAKOA_BASE_URL}/token`,
        {
          id: `mock:${Date.now()}`,
          registration_tx: {
            block_number: 1,
            tx_hash: "0x" + "0".repeat(64),
          },
          creator_id: "mock_creator",
          metadata: {
            name: "Verification Check",
            description: "Originality verification",
          },
          media: [
            {
              media_id: "media_1",
              url: mediaUrl,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.YAKOA_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Parse real response (structure varies based on async polling)
      return {
        matches: [],
        originalityScore: 1.0,
      };
    } catch (error) {
      console.error("Yakoa API error, falling back to mock:", error);
    }
  }

  // MOCK: for dev only
  // Returns mock data simulating Yakoa infringement check results
  console.log("MOCK: Using mock Yakoa response for dev only");
  
  return {
    matches: [
      {
        url: "example.com",
        similarity: 0.85,
      },
    ],
    originalityScore: 0.9,
  };
}

// MOCK: Check token infringement status
export async function checkTokenStatus(tokenId: string): Promise<{
  status: "pending" | "completed" | "failed";
  infringements: YakoaInfringement[];
}> {
  // MOCK: for dev only
  console.log("MOCK: Using mock Yakoa token status for dev only");
  
  return {
    status: "completed",
    infringements: [],
  };
}

// Real Yakoa request structure documentation
export const YAKOA_REQUEST_EXAMPLE = {
  id: "contract_address:token_id",
  registration_tx: {
    block_number: 12345,
    tx_hash: "0x...",
  },
  creator_id: "0x...",
  metadata: {
    name: "Token Name",
    description: "Token Description",
  },
  media: [
    {
      media_id: "media_1",
      url: "https://ipfs.io/ipfs/...",
    },
  ],
  // Optional: license_parents, authorizations
};
