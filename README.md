# Stellark - IP Rights Management on Story Protocol

Stellark is a full-stack application for managing intellectual property rights on the Story Protocol blockchain. It allows users to parse license text, register IP assets, and classify usage against rights schemas.

## 🚀 Features

- **License Parser**: Parse any license text (CC-BY, MIT, etc.) into a structured Stellark Rights Schema using AI
- **IP Registration**: Register IP assets on Story Protocol with metadata stored on IPFS
- **Usage Classification**: Check if specific usage contexts comply with rights schemas
- **Wallet Integration**: Connect with MetaMask or other Web3 wallets via wagmi

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- MetaMask or Web3 wallet
- Story Protocol testnet tokens (from faucet)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Blockchain**: Story Protocol SDK (@story-protocol/core-sdk)
- **IPFS**: Pinata Web3 SDK
- **AI**: Groq (Llama 3.1-8B)

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **State**: TanStack Query

## 📁 Project Structure

```
stellark/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/               # API route handlers
│   │   │   ├── parseLicense.ts
│   │   │   ├── registerIP.ts
│   │   │   ├── verifyOriginality.ts
│   │   │   └── classifyUsage.ts
│   │   ├── services/             # Business logic
│   │   │   ├── storyService.ts   # Story Protocol integration
│   │   │   ├── groqService.ts    # LLM parsing
│   │   │   ├── yakoaService.ts   # Originality check (MOCK)
│   │   │   └── classificationService.ts
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utilities
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx         # wagmi/React Query providers
│   │   ├── globals.css
│   │   └── api/                  # API route proxies
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── LicenseParser.tsx
│   │   ├── RegisterIP.tsx
│   │   └── UsageClassifier.tsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Backend (`.env`):
```env
# Story Protocol
WALLET_PRIVATE_KEY=your_private_key_without_0x_prefix
RPC_PROVIDER_URL=https://aeneid.storyrpc.io

# Pinata IPFS
PINATA_JWT=your_pinata_jwt_token

# Groq LLM
GROQ_API_KEY=your_groq_api_key

# Database
DATABASE_URL=file:./dev.db

# Server
PORT=3001
```

Frontend (`.env.local`):
```env
BACKEND_URL=http://localhost:3001
```

### 3. Setup Database

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Get Testnet Tokens

1. Visit the Story Aeneid faucet: https://docs.story.foundation/network/network-info/aeneid#faucet
2. Request testnet IP tokens for your wallet

### 5. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:3000 to use the application.

## 📚 API Endpoints

### POST /api/parse-license
Parse license text into Stellark Rights Schema.

**Request:**
```json
{
  "licenseText": "CC-BY 4.0 Attribution required..."
}
```

**Response:**
```json
{
  "schema": {
    "allowDerivatives": true,
    "allowCommercialUse": true,
    "attributionRequired": true,
    "shareAlike": false,
    "royaltyRateBps": 0,
    "territory": ["worldwide"],
    "prohibitedUses": [],
    "allowedPlatforms": []
  },
  "confidence": 0.95
}
```

### POST /api/register-ip
Register an IP asset on Story Protocol.

**Request:**
```json
{
  "nftMetadata": {
    "name": "My IP Asset",
    "description": "Description",
    "image": "https://ipfs.io/ipfs/..."
  },
  "ipMetadata": {
    "title": "My IP",
    "description": "Description",
    "image": "https://ipfs.io/ipfs/..."
  },
  "rightsSchema": {...}
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

### POST /api/classify-usage
Classify usage against a rights schema.

**Request:**
```json
{
  "rightsSchema": {...},
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
  "reason": "Commercial use not allowed",
  "recommendations": [...]
}
```

## 📖 Stellark Rights Schema

```typescript
interface RightsSchema {
  allowDerivatives: boolean;      // Can create derivative works
  allowCommercialUse: boolean;    // Can use commercially
  attributionRequired: boolean;   // Must give credit
  shareAlike: boolean;            // Derivatives must use same license
  royaltyRateBps: number;         // Royalty rate in basis points (100 = 1%)
  territory: string[];            // Geographic restrictions
  prohibitedUses: string[];       // Explicitly forbidden uses
  allowedPlatforms: string[];     // Platform restrictions (optional)
}
```

## 🔗 Resources

- [Story Protocol Docs](https://docs.story.foundation)
- [Story SDK Reference](https://docs.story.foundation/sdk-reference/ipasset)
- [Aeneid Testnet Explorer](https://aeneid.explorer.story.foundation)
- [Pinata IPFS](https://pinata.cloud)
- [Groq AI](https://groq.com)

## 📜 License

MIT License

## ⚠️ Disclaimer

This is an MVP for educational/demonstration purposes. The Yakoa API integration is mocked for development. Always verify rights and compliance in production scenarios.
