// Parse License Route

import { Router, Request, Response } from "express";
import { parseLicense } from "../services/groqService";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /parse-license
router.post("/", async (req: Request, res: Response) => {
  try {
    const { licenseText } = req.body;

    if (!licenseText || typeof licenseText !== "string") {
      return res.status(400).json({
        error: "licenseText is required and must be a string",
      });
    }

    if (licenseText.length > 10000) {
      return res.status(400).json({
        error: "licenseText exceeds maximum length of 10000 characters",
      });
    }

    // Parse the license
    const result = await parseLicense(licenseText);

    // Store in database
    await prisma.parsedLicense.create({
      data: {
        licenseText,
        parsedSchema: JSON.stringify(result.schema),
        confidence: result.confidence,
      },
    });

    return res.json(result);
  } catch (error) {
    console.error("Error parsing license:", error);
    return res.status(500).json({
      error: "Failed to parse license",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
