// Groq LLM Service - For parsing license text
// Using Groq free tier Llama3.1-8B

import Groq from "groq-sdk";
import { RightsSchema } from "../types";
import { DEFAULT_RIGHTS_SCHEMA } from "../utils/constants";

// Lazy initialization to avoid crashing when API key is not set
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

// LLM Parsing Prompt Template - EXACT from MVP plan
const PARSE_TEMPLATE = `Parse this license text into Stellark Rights Schema JSON only. Output VALID JSON. Fields exactly as schema. Infer conservatively; default false/null if ambiguous.
License: {input}`;

export interface ParseResult {
  schema: RightsSchema;
  confidence: number;
}

export async function parseLicenseText(licenseText: string): Promise<ParseResult> {
  const prompt = PARSE_TEMPLATE.replace("{input}", licenseText);

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a legal document parser. Output ONLY valid JSON matching this schema:
{
  "allowDerivatives": boolean,
  "allowCommercialUse": boolean,
  "attributionRequired": boolean,
  "shareAlike": boolean,
  "royaltyRateBps": number (basis points, 100 = 1%),
  "territory": string[] (e.g., ["worldwide"] or ["US", "EU"]),
  "prohibitedUses": string[] (e.g., ["adult-content", "weapons"]),
  "allowedPlatforms": string[] (optional, e.g., ["story.foundation"])
}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content || "{}";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Failed to extract JSON from LLM response:", content);
      return {
        schema: DEFAULT_RIGHTS_SCHEMA,
        confidence: 0.3,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and set defaults
    const schema: RightsSchema = {
      allowDerivatives: typeof parsed.allowDerivatives === "boolean" ? parsed.allowDerivatives : false,
      allowCommercialUse: typeof parsed.allowCommercialUse === "boolean" ? parsed.allowCommercialUse : false,
      attributionRequired: typeof parsed.attributionRequired === "boolean" ? parsed.attributionRequired : true,
      shareAlike: typeof parsed.shareAlike === "boolean" ? parsed.shareAlike : false,
      royaltyRateBps: typeof parsed.royaltyRateBps === "number" ? parsed.royaltyRateBps : 0,
      territory: Array.isArray(parsed.territory) ? parsed.territory : ["worldwide"],
      prohibitedUses: Array.isArray(parsed.prohibitedUses) ? parsed.prohibitedUses : [],
      allowedPlatforms: Array.isArray(parsed.allowedPlatforms) ? parsed.allowedPlatforms : [],
    };

    return {
      schema,
      confidence: 0.9,
    };
  } catch (error) {
    console.error("Error parsing license with Groq:", error);
    return {
      schema: DEFAULT_RIGHTS_SCHEMA,
      confidence: 0.1,
    };
  }
}

// Parse common license types
export function parseKnownLicense(licenseText: string): ParseResult | null {
  const text = licenseText.toLowerCase();

  // CC-BY (Attribution)
  if (text.includes("cc-by") && !text.includes("nc") && !text.includes("nd") && !text.includes("sa")) {
    return {
      schema: {
        allowDerivatives: true,
        allowCommercialUse: true,
        attributionRequired: true,
        shareAlike: false,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  // CC-BY-SA (Attribution-ShareAlike)
  if (text.includes("cc-by-sa") || (text.includes("cc-by") && text.includes("sa"))) {
    return {
      schema: {
        allowDerivatives: true,
        allowCommercialUse: true,
        attributionRequired: true,
        shareAlike: true,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  // CC-BY-NC (Attribution-NonCommercial)
  if (text.includes("cc-by-nc") || (text.includes("cc-by") && text.includes("nc") && !text.includes("nd"))) {
    return {
      schema: {
        allowDerivatives: true,
        allowCommercialUse: false,
        attributionRequired: true,
        shareAlike: false,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  // CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)
  if (text.includes("cc-by-nc-sa")) {
    return {
      schema: {
        allowDerivatives: true,
        allowCommercialUse: false,
        attributionRequired: true,
        shareAlike: true,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  // CC-BY-ND (Attribution-NoDerivatives)
  if (text.includes("cc-by-nd") || (text.includes("cc-by") && text.includes("nd"))) {
    return {
      schema: {
        allowDerivatives: false,
        allowCommercialUse: true,
        attributionRequired: true,
        shareAlike: false,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  // CC0 (Public Domain)
  if (text.includes("cc0") || text.includes("public domain")) {
    return {
      schema: {
        allowDerivatives: true,
        allowCommercialUse: true,
        attributionRequired: false,
        shareAlike: false,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.98,
    };
  }

  // All Rights Reserved
  if (text.includes("all rights reserved")) {
    return {
      schema: {
        allowDerivatives: false,
        allowCommercialUse: false,
        attributionRequired: true,
        shareAlike: false,
        royaltyRateBps: 0,
        territory: ["worldwide"],
        prohibitedUses: [],
        allowedPlatforms: [],
      },
      confidence: 0.95,
    };
  }

  return null;
}

// Combined parser - tries known licenses first, then LLM
export async function parseLicense(licenseText: string): Promise<ParseResult> {
  // Try known license patterns first
  const knownResult = parseKnownLicense(licenseText);
  if (knownResult) {
    return knownResult;
  }

  // Fall back to LLM parsing
  return parseLicenseText(licenseText);
}
