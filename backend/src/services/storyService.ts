// Story Protocol Service - EXACT from docs
// From https://docs.story.foundation/developers/typescript-sdk/register-ip-asset [web:34]
// From https://docs.story.foundation/sdk-reference/ipasset [web:32]

import { http } from "viem";
import { privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig, IpMetadata as StoryIpMetadata } from "@story-protocol/core-sdk";
import { parseEther } from "viem";
import { uploadJSONToIPFS } from "../utils/uploadToIpfs";
import { getMetadataHash, getHashFromUrl } from "../utils/hashContent";
import { SPG_NFT_CONTRACT, CHAIN_ID, EXPLORER_BASE_URL, IPFS_GATEWAY } from "../utils/constants";
import type { IpMetadata, NftMetadata, RightsSchema, RegisterIpResponse } from "../types";

// Initialize Story Client - EXACT from docs [web:32]
function getStoryClient(): StoryClient {
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("WALLET_PRIVATE_KEY environment variable is not set");
  }
  const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
  const account = privateKeyToAccount(privateKey);

  const config: StoryConfig = {
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL || "https://aeneid.storyrpc.io"),
    chainId: CHAIN_ID,
  };

  return StoryClient.newClient(config);
}

// Register IP Asset - EXACT from docs [web:34]
export async function registerIPAsset(
  nftMetadata: NftMetadata,
  ipMetadata: IpMetadata,
  rightsSchema?: RightsSchema
): Promise<RegisterIpResponse> {
  const client = getStoryClient();

  // Prepare IP metadata with imageHash if image URL provided
  const fullIpMetadata: any = {
    ...ipMetadata,
    createdAt: ipMetadata.createdAt || new Date().toISOString(),
  };

  // Get image hash if URL provided - EXACT from docs [web:97]
  if (ipMetadata.image && !ipMetadata.imageHash) {
    try {
      fullIpMetadata.imageHash = await getHashFromUrl(ipMetadata.image);
    } catch (e) {
      console.warn("Could not fetch image hash:", e);
    }
  }

  // Get media hash if URL provided
  if (ipMetadata.mediaUrl && !ipMetadata.mediaHash) {
    try {
      fullIpMetadata.mediaHash = await getHashFromUrl(ipMetadata.mediaUrl);
    } catch (e) {
      console.warn("Could not fetch media hash:", e);
    }
  }

  // Add rights schema as custom field
  if (rightsSchema) {
    fullIpMetadata.stellarkRights = rightsSchema;
  }

  // Upload metadata to IPFS - EXACT from docs [web:34]
  const ipIpfsHash = await uploadJSONToIPFS(fullIpMetadata);
  const ipHash = getMetadataHash(fullIpMetadata);
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = getMetadataHash(nftMetadata);

  // Register IP Asset - EXACT from docs [web:34]
  // Using PILFlavor for license terms as shown in docs
  const response = await client.ipAsset.registerIpAsset({
    nft: {
      type: "mint",
      spgNftContract: SPG_NFT_CONTRACT as Address,
    },
    ipMetadata: {
      ipMetadataURI: `${IPFS_GATEWAY}/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}` as `0x${string}`,
      nftMetadataURI: `${IPFS_GATEWAY}/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}` as `0x${string}`,
    },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );

  return {
    txHash: response.txHash as string,
    ipId: response.ipId as string,
    explorerUrl: `${EXPLORER_BASE_URL}/ipa/${response.ipId}`,
  };
}

// Register IP Asset with License Terms - EXACT from docs [web:34]
export async function registerIPAssetWithLicense(
  nftMetadata: NftMetadata,
  ipMetadata: IpMetadata,
  rightsSchema?: RightsSchema,
  commercialRevShare: number = 5,
  mintingFee: string = "1"
): Promise<RegisterIpResponse> {
  const client = getStoryClient();
  
  // Dynamic import to handle PILFlavor and WIP_TOKEN_ADDRESS
  const { PILFlavor, WIP_TOKEN_ADDRESS } = await import("@story-protocol/core-sdk");

  // Prepare IP metadata
  const fullIpMetadata: any = {
    ...ipMetadata,
    createdAt: ipMetadata.createdAt || new Date().toISOString(),
  };

  if (ipMetadata.image && !ipMetadata.imageHash) {
    try {
      fullIpMetadata.imageHash = await getHashFromUrl(ipMetadata.image);
    } catch (e) {
      console.warn("Could not fetch image hash:", e);
    }
  }

  if (rightsSchema) {
    fullIpMetadata.stellarkRights = rightsSchema;
  }

  // Upload metadata to IPFS
  const ipIpfsHash = await uploadJSONToIPFS(fullIpMetadata);
  const ipHash = getMetadataHash(fullIpMetadata);
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = getMetadataHash(nftMetadata);

  // Register IP Asset with License Terms - EXACT from docs [web:34]
  const response = await client.ipAsset.registerIpAsset({
    nft: {
      type: "mint",
      spgNftContract: SPG_NFT_CONTRACT as Address,
    },
    licenseTermsData: [
      {
        terms: PILFlavor.commercialRemix({
          commercialRevShare: commercialRevShare,
          defaultMintingFee: parseEther(mintingFee),
          currency: WIP_TOKEN_ADDRESS,
        }),
      },
    ],
    ipMetadata: {
      ipMetadataURI: `${IPFS_GATEWAY}/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}` as `0x${string}`,
      nftMetadataURI: `${IPFS_GATEWAY}/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}` as `0x${string}`,
    },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
  console.log(
    `View on the explorer: ${EXPLORER_BASE_URL}/ipa/${response.ipId}`
  );

  return {
    txHash: response.txHash as string,
    ipId: response.ipId as string,
    explorerUrl: `${EXPLORER_BASE_URL}/ipa/${response.ipId}`,
  };
}
