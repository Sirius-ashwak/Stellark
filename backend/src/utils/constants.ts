// Story Protocol Constants - EXACT from docs
// From https://docs.story.foundation/developers/typescript-sdk/register-ip-asset [web:34]

// Public SPG NFT Contract (Aeneid testnet)
export const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc";

// RoyaltyPolicyLAP address (Aeneid) - from SDK reference
export const ROYALTY_POLICY_LAP = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";

// Network
export const CHAIN_ID = "aeneid";
export const EXPLORER_BASE_URL = "https://aeneid.explorer.story.foundation";

// IPFS Gateway
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";

// Stellark Rights Schema defaults
export const DEFAULT_RIGHTS_SCHEMA = {
  allowDerivatives: false,
  allowCommercialUse: false,
  attributionRequired: true,
  shareAlike: false,
  royaltyRateBps: 0,
  territory: ["worldwide"],
  prohibitedUses: [],
  allowedPlatforms: [],
};

// Commercial domains for classification
export const COMMERCIAL_DOMAINS = [
  "shopify.com",
  "amazon.com",
  "etsy.com",
  "ebay.com",
  "alibaba.com",
  "walmart.com",
];
