// Classify Usage Route

import { Router, Request, Response } from "express";
import { classifyUsage, getUsageRecommendations } from "../services/classificationService";
import { PrismaClient } from "@prisma/client";
import { RightsSchema, UsageContext } from "../types";

const router = Router();
const prisma = new PrismaClient();

// POST /classify-usage
router.post("/", async (req: Request, res: Response) => {
  try {
    const { rightsSchema, usageContext, ipAssetId } = req.body as {
      rightsSchema: RightsSchema;
      usageContext: UsageContext;
      ipAssetId?: string;
    };

    // Validate required fields
    if (!rightsSchema) {
      return res.status(400).json({
        error: "rightsSchema is required",
      });
    }

    if (!usageContext || !usageContext.domain || !usageContext.useType) {
      return res.status(400).json({
        error: "usageContext with domain and useType is required",
      });
    }

    // Validate useType
    const validUseTypes = ["commercial", "non-commercial", "derivative", "educational"];
    if (!validUseTypes.includes(usageContext.useType)) {
      return res.status(400).json({
        error: `useType must be one of: ${validUseTypes.join(", ")}`,
      });
    }

    // Classify usage
    const result = classifyUsage(rightsSchema, usageContext);
    const recommendations = getUsageRecommendations(rightsSchema);

    // Store in database if ipAssetId provided
    if (ipAssetId) {
      await prisma.usageCheck.create({
        data: {
          ipAssetId,
          domain: usageContext.domain,
          useType: usageContext.useType,
          classification: result.classification,
          reason: result.reason,
        },
      });
    }

    return res.json({
      ...result,
      recommendations,
    });
  } catch (error) {
    console.error("Error classifying usage:", error);
    return res.status(500).json({
      error: "Failed to classify usage",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /classify-usage/recommendations
router.post("/recommendations", async (req: Request, res: Response) => {
  try {
    const { rightsSchema } = req.body as { rightsSchema: RightsSchema };

    if (!rightsSchema) {
      return res.status(400).json({
        error: "rightsSchema is required",
      });
    }

    const recommendations = getUsageRecommendations(rightsSchema);

    return res.json({ recommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return res.status(500).json({
      error: "Failed to get recommendations",
    });
  }
});

export default router;
