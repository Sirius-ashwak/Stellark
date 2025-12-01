// Hash Content Utilities - EXACT from docs
// From https://docs.story.foundation/concepts/ip-asset/ipa-metadata-standard [web:97]

import { createHash } from "crypto";
import axios from "axios";

// Get hash from JSON metadata
export function getMetadataHash(metadata: any): string {
  return createHash("sha256")
    .update(JSON.stringify(metadata))
    .digest("hex");
}

// Get hash from a URL - EXACT from docs
export async function getHashFromUrl(url: string): Promise<string> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}

// Get hash from buffer
export function getHashFromBuffer(buffer: Buffer): string {
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}
