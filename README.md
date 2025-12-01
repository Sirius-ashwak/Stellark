<p align="center">
  <h1 align="center">Stellark</h1>
  <p align="center">Programmable IP Rights Infrastructure on Story Protocol</p>
</p>

<p align="center">
  <a href="https://github.com/Sirius-ashwak/Stellark/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://docs.story.foundation"><img src="https://img.shields.io/badge/Story-Protocol-purple.svg" alt="Story Protocol"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-20%2B-green.svg" alt="Node"></a>
</p>

---

Stellark transforms natural language license terms into structured, on-chain IP rights. Parse any license (CC-BY, MIT, custom terms), register assets on Story Protocol, and programmatically verify usage compliance.

## Why Stellark

Current IP management is fragmented. License terms exist in PDFs, legal documents, and scattered metadata. Stellark creates a unified schema that machines can read, blockchains can enforce, and creators can trust.

**Parse** - Convert license text into structured rights using LLM  
**Register** - Mint IP assets on Story Protocol with IPFS metadata  
**Classify** - Check usage contexts against rights schemas in real-time

## Quick Start

```bash
# Clone
git clone https://github.com/Sirius-ashwak/Stellark.git
cd Stellark

# Backend
cd backend
npm install
cp .env.example .env  # Configure your keys
npx prisma generate && npx prisma db push
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000)

## Configuration

### Backend `.env`

```
WALLET_PRIVATE_KEY=your_private_key_without_0x
RPC_PROVIDER_URL=https://aeneid.storyrpc.io
PINATA_JWT=your_pinata_jwt
GROQ_API_KEY=your_groq_key
DATABASE_URL=file:./dev.db
PORT=3001
```

### Frontend `.env.local`

```
BACKEND_URL=http://localhost:3001
```

Get testnet tokens from the [Story Aeneid Faucet](https://docs.story.foundation/network/network-info/aeneid#faucet).

## API

### Parse License

```
POST /api/parse-license
```

```json
{
  "licenseText": "Creative Commons Attribution 4.0..."
}
```

Returns structured `RightsSchema` with confidence score.

### Register IP

```
POST /api/register-ip
```

```json
{
  "nftMetadata": { "name": "...", "description": "...", "image": "..." },
  "ipMetadata": { "title": "...", "description": "...", "image": "..." },
  "rightsSchema": { ... }
}
```

Returns `txHash`, `ipId`, and explorer URL.

### Classify Usage

```
POST /api/classify-usage
```

```json
{
  "rightsSchema": { ... },
  "usageContext": { "domain": "example.com", "useType": "commercial" }
}
```

Returns classification, reasoning, and recommendations.

## Rights Schema

```typescript
interface RightsSchema {
  allowDerivatives: boolean
  allowCommercialUse: boolean
  attributionRequired: boolean
  shareAlike: boolean
  royaltyRateBps: number
  territory: string[]
  prohibitedUses: string[]
  allowedPlatforms: string[]
}
```

## Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Story Protocol SDK, Aeneid Testnet |
| Storage | IPFS via Pinata |
| AI | Groq (Llama 3.1-8B) |
| Backend | Node.js, Express, Prisma, SQLite |
| Frontend | Next.js 14, Tailwind CSS, wagmi |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Resources

- [Story Protocol Documentation](https://docs.story.foundation)
- [Story SDK Reference](https://docs.story.foundation/sdk-reference/ipasset)
- [Aeneid Explorer](https://aeneid.explorer.story.foundation)

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built for the programmable IP economy
</p>
