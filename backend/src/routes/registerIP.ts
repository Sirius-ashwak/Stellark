// Register IP Route

import { Router, Request, Response } from "express";
import { registerIPAsset, registerIPAssetWithLicense } from "../services/storyService";
import { PrismaClient } from "@prisma/client";
import { RegisterIpRequest } from "../types";

const router = Router();
const prisma = new PrismaClient();

// POST /register-ip
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nftMetadata, ipMetadata, rightsSchema, withLicense } = req.body as RegisterIpRequest & { withLicense?: boolean };

    // Validate required fields
    if (!nftMetadata || !ipMetadata) {
      return res.status(400).json({
        error: "nftMetadata and ipMetadata are required",
      });
    }

    if (!nftMetadata.name || !nftMetadata.description || !nftMetadata.image) {
      return res.status(400).json({
        error: "nftMetadata must include name, description, and image",
      });
    }

    if (!ipMetadata.title || !ipMetadata.description) {
      return res.status(400).json({
        error: "ipMetadata must include title and description",
      });
    }

    // Register IP Asset
    let result;
    if (withLicense) {
      result = await registerIPAssetWithLicense(nftMetadata, ipMetadata, rightsSchema);
    } else {
      result = await registerIPAsset(nftMetadata, ipMetadata, rightsSchema);
    }

    // Store in database
    await prisma.iPAsset.create({
      data: {
        ipId: result.ipId,
        txHash: result.txHash,
        title: ipMetadata.title,
        description: ipMetadata.description,
        imageUrl: ipMetadata.image || nftMetadata.image,
        mediaUrl: ipMetadata.mediaUrl,
        creatorAddr: ipMetadata.creators?.[0]?.address || "unknown",
        rightsSchema: rightsSchema ? JSON.stringify(rightsSchema) : "{}",
      },
    });

    return res.json(result);
  } catch (error) {
    console.error("Error registering IP:", error);
    return res.status(500).json({
      error: "Failed to register IP asset",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /register-ip/:ipId
router.get("/:ipId", async (req: Request, res: Response) => {
  try {
    const { ipId } = req.params;

    const ipAsset = await prisma.iPAsset.findUnique({
      where: { ipId },
    });

    if (!ipAsset) {
      return res.status(404).json({
        error: "IP Asset not found",
      });
    }

    return res.json({
      ...ipAsset,
      rightsSchema: JSON.parse(ipAsset.rightsSchema),
    });
  } catch (error) {
    console.error("Error fetching IP asset:", error);
    return res.status(500).json({
      error: "Failed to fetch IP asset",
    });
  }
});

export default router;
