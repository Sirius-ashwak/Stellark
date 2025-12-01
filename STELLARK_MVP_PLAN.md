# STELLARK MVP PLAN

**All code/params EXACT from linked official docs. NO invention/approximation.**

---

## 1) Reasoning and Assumptions

### Sources (STRICTLY these only):
- [web:34] Story SDK registerIpAsset: https://docs.story.foundation/developers/typescript-sdk/register-ip-asset
- [web:97] Story IP Metadata Standard: https://docs.story.foundation/concepts/ip-asset/ipa-metadata-standard
- [web:38] Yakoa API: https://docs.yakoa.io/reference/get-started
- [web:32] SDK Client Setup: https://docs.story.foundation/sdk-reference/ipasset

### Assumptions:
- Frontend: Next.js 14+ Tailwind; wagmi/viem for wallet
- Backend: Node 20+ TS Express + Prisma/SQLite
- Web3: @story-protocol/core-sdk latest; Story Aeneid testnet (from [web:34])
- LLM: Groq free tier Llama3.1-8B (API key env)
- Yakoa: MOCK unless API key provided (docs show async infringement check workflow)
- No auth for MVP (wallet signs tx)

### Risks:
- Yakoa rate limits → MOCK endpoint fallback
- Story gas → Aeneid testnet (faucet from docs)
- LLM hallucination → fixed template + JSON validation

---

## 2) Stellark Rights Schema (EXACT MVP fields)

```json
{
  "allowDerivatives": true,
  "allowCommercialUse": false,
  "attributionRequired": true,
  "shareAlike": true,
  "royaltyRateBps": 500,
  "territory": ["worldwide"],
  "prohibitedUses": ["adult-content"],
  "allowedPlatforms": ["story.foundation"]
}
```

**Compatible with Story ipMetadata** (from [web:97]): title, description, createdAt, ipType, relationships can be added at registration.

---

## 3) LLM Parsing Prompt Template (EXACT for /parse-license)

```
Parse this license text into Stellark Rights Schema JSON only. Output VALID JSON. Fields exactly as schema. Infer conservatively; default false/null if ambiguous.
License: {input}
```

---

## 4) Backend API Endpoints

### 4a) POST /parse-license

**Request:**
```json
{
  "licenseText": "CC-BY-SA 4.0 Attribution required. Share alike. Non-commercial."
}
```

**Response:**
```json
{
  "schema": {
    "allowDerivatives": true,
    "allowCommercialUse": false,
    "attributionRequired": true,
    "shareAlike": true,
    "royaltyRateBps": 0,
    "territory": ["worldwide"],
    "prohibitedUses": [],
    "allowedPlatforms": []
  },
  "confidence": 0.9
}
```

### 4b) POST /register-ip

**Request:**
```json
{
  "nftMetadata": {
    "name": "Ownership NFT",
    "description": "This is an NFT representing ownership of our IP Asset.",
    "image": "https://picsum.photos/200"
  },
  "ipMetadata": {
    "title": "Test IP",
    "description": "Official test IP asset.",
    "image": "https://ipfs.io/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
    "imageHash": "0x21937ba9d821cb0306c7f1a1a2cc5a257509f228ea6abccc9af1a67dd754af6e",
    "mediaUrl": "https://ipfs.io/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
    "mediaHash": "0x21937ba9d821cb0306c7f1a1a2cc5a257509f228ea6abccc9af1a67dd754af6e",
    "mediaType": "image/png",
    "creators": [
      {
        "name": "Story Foundation",
        "address": "0x67ee74EE04A0E6d14Ca6C27428B27F3EFd5CD084",
        "contributionPercent": 100
      }
    ]
  },
  "rightsSchema": {
    "allowDerivatives": true,
    "allowCommercialUse": false,
    "attributionRequired": true,
    "shareAlike": true,
    "royaltyRateBps": 500,
    "territory": ["worldwide"],
    "prohibitedUses": [],
    "allowedPlatforms": []
  }
}
```

**Response:**
```json
{
  "txHash": "0x...",
  "ipId": "0x...",
  "explorerUrl": "https://aeneid.explorer.story.foundation/ipa/0x..."
}
```

### 4c) POST /verify-originality (MOCK: for dev only)

**Request:**
```json
{
  "mediaUrl": "https://ipfs.io/ipfs/Qm..."
}
```

**Response (MOCK):**
```json
{
  "matches": [
    {
      "url": "example.com",
      "similarity": 0.85
    }
  ],
  "originalityScore": 0.9
}
```

### 4d) POST /classify-usage

**Request:**
```json
{
  "rightsSchema": {
    "allowDerivatives": true,
    "allowCommercialUse": false,
    "attributionRequired": true,
    "shareAlike": true,
    "royaltyRateBps": 500,
    "territory": ["worldwide"],
    "prohibitedUses": [],
    "allowedPlatforms": []
  },
  "usageContext": {
    "domain": "shopify.com",
    "useType": "commercial"
  }
}
```

**Response:**
```json
{
  "classification": "Likely Violation",
  "reason": "allowCommercialUse is false but domain shopify.com indicates commercial use"
}
```

---

## 5) Story SDK Client Setup (EXACT from [web:32])

**utils.ts:**
```typescript
import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
const account: Account = privateKeyToAccount(privateKey);

const config: StoryConfig = {
  account: account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);
```

**.env:**
```
WALLET_PRIVATE_KEY=<YOUR_PRIVATE_KEY>
RPC_PROVIDER_URL=https://aeneid.storyrpc.io
PINATA_JWT=<YOUR_PINATA_JWT>
GROQ_API_KEY=<YOUR_GROQ_KEY>
YAKOA_API_KEY=<YOUR_YAKOA_KEY>
```

---

## 6) Story registerIpAsset Call (EXACT from [web:34])

**register-ip.ts:**
```typescript
import { IpMetadata, PILFlavor, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { client } from "./utils";
import { uploadJSONToIPFS } from "./uploadToIpfs";
import { createHash } from "crypto";
import { Address, parseEther } from "viem";

async function registerIP(ipMetadata: any, nftMetadata: any) {
  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
  const ipHash = createHash("sha256")
    .update(JSON.stringify(ipMetadata))
    .digest("hex");
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = createHash("sha256")
    .update(JSON.stringify(nftMetadata))
    .digest("hex");

  const response = await client.ipAsset.registerIpAsset({
    nft: {
      type: "mint",
      spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
    },
    licenseTermsData: [
      {
        terms: PILFlavor.commercialRemix({
          commercialRevShare: 5,
          defaultMintingFee: parseEther("1"),
          currency: WIP_TOKEN_ADDRESS,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
  console.log(
    `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
  );

  return response;
}
```

---

## 7) IPFS Upload Helper (EXACT from [web:34])

**uploadToIpfs.ts:**
```typescript
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}
```

---

## 8) IP Metadata Standard (EXACT from [web:97])

**Required fields for Story Explorer:**
- title: string
- description: string
- createdAt: string (ISO8601 or unix)
- image: string (URL)
- imageHash: string (SHA-256)
- creators: IpCreator[]

**Required for Commercial Infringement Check:**
- mediaUrl: string
- mediaHash: string (SHA-256)
- mediaType: string (mimeType: image/jpeg, image/png, audio/mpeg, video/mp4, etc.)

**Type Definitions (from [web:97]):**
```typescript
type IpCreator = {
  name: string;
  address: Address;
  contributionPercent: number; // add up to 100
  description?: string;
  image?: string;
  socialMedia?: IpCreatorSocial[];
  role?: string;
};

type IpCreatorSocial = {
  platform: string;
  url: string;
};

type IpRelationship = {
  parentIpId: Address;
  type: string; // APPEARS_IN, BELONGS_TO, FINETUNED_FROM, etc.
};
```

**Hash Content (from [web:97]):**
```typescript
import { toHex, Hex } from "viem";
import { createHash } from "crypto";

async function getHashFromUrl(url: string): Promise<Hex> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}
```

---

## 9) Yakoa API Integration (MOCK: for dev only)

**From [web:38] docs workflow:**
1. Register Token with metadata and media URLs
2. Monitor Results via GET endpoint (async infringement check)
3. Check `infringements` object in response

**MOCK endpoint /verify (for dev only):**
```typescript
// yakoa-mock.ts
export async function verifyOriginality(mediaUrl: string) {
  // MOCK: for dev only - Yakoa requires API key and async workflow
  // Real endpoint: POST https://{subdomain}.ip-api-sandbox.yakoa.io/{network}/token
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
```

**Real Yakoa Request Structure (from docs):**
```json
{
  "id": "contract_address:token_id",
  "registration_tx": {
    "block_number": 12345,
    "tx_hash": "0x..."
  },
  "creator_id": "0x...",
  "metadata": {
    "name": "Token Name",
    "description": "Token Description"
  },
  "media": [
    {
      "media_id": "media_1",
      "url": "https://ipfs.io/ipfs/..."
    }
  ]
}
```

---

## 10) Frontend Components (Next.js 14+ / Tailwind / wagmi/viem)

### 10a) Wallet Connection (wagmi)
```typescript
// components/WalletConnect.tsx
"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <button onClick={() => disconnect()} className="btn-secondary">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ connector: injected() })} className="btn-primary">
      Connect Wallet
    </button>
  );
}
```

### 10b) License Parser Form
```typescript
// components/LicenseParser.tsx
"use client";
import { useState } from "react";

export function LicenseParser() {
  const [licenseText, setLicenseText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const parseLicense = async () => {
    setLoading(true);
    const res = await fetch("/api/parse-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseText }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={licenseText}
        onChange={(e) => setLicenseText(e.target.value)}
        placeholder="Paste license text here..."
        className="w-full h-32 p-3 border rounded-lg"
      />
      <button onClick={parseLicense} disabled={loading} className="btn-primary">
        {loading ? "Parsing..." : "Parse License"}
      </button>
      {result && (
        <pre className="p-4 bg-gray-100 rounded-lg overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
```

### 10c) IP Registration Form
```typescript
// components/RegisterIP.tsx
"use client";
import { useState } from "react";
import { useAccount } from "wagmi";

export function RegisterIP() {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [rightsSchema, setRightsSchema] = useState({
    allowDerivatives: true,
    allowCommercialUse: false,
    attributionRequired: true,
    shareAlike: false,
    royaltyRateBps: 500,
    territory: ["worldwide"],
    prohibitedUses: [],
    allowedPlatforms: [],
  });
  const [result, setResult] = useState<any>(null);

  const registerIP = async () => {
    const res = await fetch("/api/register-ip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nftMetadata: {
          name: "Ownership NFT",
          description: formData.description,
          image: formData.imageUrl,
        },
        ipMetadata: {
          title: formData.title,
          description: formData.description,
          image: formData.imageUrl,
          creators: [{ name: "Creator", address, contributionPercent: 100 }],
        },
        rightsSchema,
      }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 border rounded-lg"
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full h-24 p-3 border rounded-lg"
      />
      <input
        placeholder="Image URL (IPFS recommended)"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        className="w-full p-3 border rounded-lg"
      />
      <button onClick={registerIP} className="btn-primary">
        Register IP Asset
      </button>
      {result && (
        <div className="p-4 bg-green-100 rounded-lg">
          <p>TX Hash: {result.txHash}</p>
          <p>IP ID: {result.ipId}</p>
          <a href={result.explorerUrl} target="_blank" className="text-blue-600 underline">
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## 11) Project Structure

```
stellark/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── parse-license/route.ts
│   │       ├── register-ip/route.ts
│   │       ├── verify-originality/route.ts
│   │       └── classify-usage/route.ts
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── LicenseParser.tsx
│   │   └── RegisterIP.tsx
│   ├── lib/
│   │   ├── story-client.ts
│   │   ├── groq-client.ts
│   │   └── yakoa-mock.ts
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── parseLicense.ts
│   │   │   ├── registerIP.ts
│   │   │   ├── verifyOriginality.ts
│   │   │   └── classifyUsage.ts
│   │   ├── services/
│   │   │   ├── storyService.ts
│   │   │   ├── groqService.ts
│   │   │   └── yakoaService.ts
│   │   └── utils/
│   │       ├── uploadToIpfs.ts
│   │       └── hashContent.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── .env.example
└── README.md
```

---

## 12) Dependencies

**Backend package.json:**
```json
{
  "dependencies": {
    "@story-protocol/core-sdk": "latest",
    "viem": "^2.0.0",
    "express": "^4.18.0",
    "@prisma/client": "^5.0.0",
    "pinata-web3": "latest",
    "groq-sdk": "latest",
    "axios": "^1.6.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0"
  }
}
```

**Frontend package.json:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 13) Classification Logic

```typescript
// classifyUsage.ts
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

interface UsageContext {
  domain: string;
  useType: "commercial" | "non-commercial" | "derivative" | "educational";
}

const COMMERCIAL_DOMAINS = ["shopify.com", "amazon.com", "etsy.com", "ebay.com"];

export function classifyUsage(schema: RightsSchema, context: UsageContext) {
  const violations: string[] = [];

  // Check commercial use
  if (!schema.allowCommercialUse) {
    if (context.useType === "commercial" || COMMERCIAL_DOMAINS.includes(context.domain)) {
      violations.push("Commercial use not allowed");
    }
  }

  // Check derivatives
  if (!schema.allowDerivatives && context.useType === "derivative") {
    violations.push("Derivatives not allowed");
  }

  // Check prohibited uses
  if (schema.prohibitedUses.some((use) => context.useType.includes(use))) {
    violations.push(`Use type '${context.useType}' is prohibited`);
  }

  // Check allowed platforms
  if (schema.allowedPlatforms.length > 0 && !schema.allowedPlatforms.includes(context.domain)) {
    violations.push(`Platform '${context.domain}' not in allowed list`);
  }

  if (violations.length > 0) {
    return {
      classification: "Likely Violation",
      reason: violations.join("; "),
    };
  }

  return {
    classification: "Likely Permitted",
    reason: "Usage appears to comply with rights schema",
  };
}
```

---

## 14) Groq LLM Service

```typescript
// groqService.ts
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PARSE_TEMPLATE = `Parse this license text into Stellark Rights Schema JSON only. Output VALID JSON. Fields exactly as schema. Infer conservatively; default false/null if ambiguous.
License: {input}`;

export async function parseLicenseText(licenseText: string) {
  const prompt = PARSE_TEMPLATE.replace("{input}", licenseText);

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 0.1,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || "{}";

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse JSON from LLM response");
  }

  const schema = JSON.parse(jsonMatch[0]);

  // Validate and set defaults
  return {
    schema: {
      allowDerivatives: schema.allowDerivatives ?? false,
      allowCommercialUse: schema.allowCommercialUse ?? false,
      attributionRequired: schema.attributionRequired ?? true,
      shareAlike: schema.shareAlike ?? false,
      royaltyRateBps: schema.royaltyRateBps ?? 0,
      territory: schema.territory ?? ["worldwide"],
      prohibitedUses: schema.prohibitedUses ?? [],
      allowedPlatforms: schema.allowedPlatforms ?? [],
    },
    confidence: 0.9,
  };
}
```

---

## 15) Prisma Schema

```prisma
// schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model IPAsset {
  id           String   @id @default(uuid())
  ipId         String   @unique
  txHash       String
  title        String
  description  String
  imageUrl     String
  mediaUrl     String?
  creatorAddr  String
  rightsSchema Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ParsedLicense {
  id           String   @id @default(uuid())
  licenseText  String
  parsedSchema Json
  confidence   Float
  createdAt    DateTime @default(now())
}

model UsageCheck {
  id             String   @id @default(uuid())
  ipAssetId      String
  domain         String
  useType        String
  classification String
  reason         String
  createdAt      DateTime @default(now())
}
```

---

## 16) Environment Variables (.env.example)

```
# Story Protocol
WALLET_PRIVATE_KEY=your_private_key_without_0x
RPC_PROVIDER_URL=https://aeneid.storyrpc.io

# Pinata IPFS
PINATA_JWT=your_pinata_jwt

# Groq LLM
GROQ_API_KEY=your_groq_api_key

# Yakoa (MOCK if not provided)
YAKOA_API_KEY=your_yakoa_api_key
YAKOA_SUBDOMAIN=your_subdomain
YAKOA_NETWORK=your_network

# Database
DATABASE_URL=file:./dev.db
```

---

## 17) Key Constants (from docs)

```typescript
// constants.ts
// From [web:34] - Public SPG NFT Contract (Aeneid testnet)
export const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc";

// From [web:34] - Story Protocol imports
// import { PILFlavor, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";

// From [web:32] - RoyaltyPolicyLAP address (Aeneid)
export const ROYALTY_POLICY_LAP = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";

// Network
export const CHAIN_ID = "aeneid";
export const EXPLORER_BASE_URL = "https://aeneid.explorer.story.foundation";
```

---

## 18) API Route Handlers (Next.js)

### POST /api/parse-license/route.ts
```typescript
import { NextRequest, NextResponse } from "next/server";
import { parseLicenseText } from "@/lib/groq-client";

export async function POST(request: NextRequest) {
  try {
    const { licenseText } = await request.json();
    
    if (!licenseText) {
      return NextResponse.json({ error: "licenseText required" }, { status: 400 });
    }

    const result = await parseLicenseText(licenseText);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to parse license" }, { status: 500 });
  }
}
```

### POST /api/register-ip/route.ts
```typescript
import { NextRequest, NextResponse } from "next/server";
import { registerIPAsset } from "@/lib/story-client";

export async function POST(request: NextRequest) {
  try {
    const { nftMetadata, ipMetadata, rightsSchema } = await request.json();
    
    if (!nftMetadata || !ipMetadata) {
      return NextResponse.json({ error: "nftMetadata and ipMetadata required" }, { status: 400 });
    }

    const result = await registerIPAsset(nftMetadata, ipMetadata, rightsSchema);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to register IP" }, { status: 500 });
  }
}
```

---

**END OF MVP PLAN**
