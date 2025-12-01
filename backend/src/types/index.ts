// Stellark Rights Schema Types

export interface RightsSchema {
  allowDerivatives: boolean;
  allowCommercialUse: boolean;
  attributionRequired: boolean;
  shareAlike: boolean;
  royaltyRateBps: number;
  territory: string[];
  prohibitedUses: string[];
  allowedPlatforms: string[];
}

export interface UsageContext {
  domain: string;
  useType: "commercial" | "non-commercial" | "derivative" | "educational";
}

export interface ClassificationResult {
  classification: "Likely Violation" | "Likely Permitted" | "Requires Review";
  reason: string;
}

// IP Metadata Types - EXACT from docs [web:97]
export interface IpCreatorSocial {
  platform: string;
  url: string;
}

export interface IpCreator {
  name: string;
  address: string;
  contributionPercent: number;
  description?: string;
  image?: string;
  socialMedia?: IpCreatorSocial[];
  role?: string;
}

export interface IpRelationship {
  parentIpId: string;
  type: string;
}

export interface IpMetadata {
  title: string;
  description: string;
  createdAt?: string;
  image?: string;
  imageHash?: string;
  mediaUrl?: string;
  mediaHash?: string;
  mediaType?: string;
  creators?: IpCreator[];
  ipType?: string;
  relationships?: IpRelationship[];
  tags?: string[];
}

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
}

export interface RegisterIpRequest {
  nftMetadata: NftMetadata;
  ipMetadata: IpMetadata;
  rightsSchema?: RightsSchema;
}

export interface RegisterIpResponse {
  txHash: string;
  ipId: string;
  explorerUrl: string;
}

export interface ParseLicenseRequest {
  licenseText: string;
}

export interface ParseLicenseResponse {
  schema: RightsSchema;
  confidence: number;
}

export interface VerifyOriginalityRequest {
  mediaUrl: string;
}

export interface VerifyOriginalityResponse {
  matches: Array<{
    url: string;
    similarity: number;
  }>;
  originalityScore: number;
}
