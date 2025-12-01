// IPFS Upload Helper - EXACT from docs
// From https://docs.story.foundation/developers/typescript-sdk/register-ip-asset [web:34]

import { PinataSDK } from "pinata-web3";

// Lazy initialization to avoid crashing when JWT is not set
let pinataClient: PinataSDK | null = null;

function getPinataClient(): PinataSDK {
  if (!pinataClient) {
    if (!process.env.PINATA_JWT) {
      throw new Error("PINATA_JWT environment variable is not set");
    }
    pinataClient = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
    });
  }
  return pinataClient;
}

export async function uploadJSONToIPFS(jsonMetadata: unknown): Promise<string> {
  const pinata = getPinataClient();
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}

export async function uploadFileToIPFS(file: Buffer, name: string): Promise<string> {
  const pinata = getPinataClient();
  const blob = new Blob([file]);
  const fileObj = new File([blob], name);
  const { IpfsHash } = await pinata.upload.file(fileObj);
  return IpfsHash;
}
