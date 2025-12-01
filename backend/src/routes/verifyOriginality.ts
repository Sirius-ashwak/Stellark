// Verify Originality Route - MOCK: for dev only

import { Router, Request, Response } from "express";
import { verifyOriginality } from "../services/yakoaService";

const router = Router();

// POST /verify-originality
// MOCK: for dev only - Yakoa requires API key
router.post("/", async (req: Request, res: Response) => {
  try {
    const { mediaUrl } = req.body;

    if (!mediaUrl || typeof mediaUrl !== "string") {
      return res.status(400).json({
        error: "mediaUrl is required and must be a string",
      });
    }

    // Validate URL format
    try {
      new URL(mediaUrl);
    } catch {
      return res.status(400).json({
        error: "mediaUrl must be a valid URL",
      });
    }

    // MOCK: for dev only
    const result = await verifyOriginality(mediaUrl);

    return res.json({
      ...result,
      _note: "MOCK: for dev only - Yakoa API requires authentication",
    });
  } catch (error) {
    console.error("Error verifying originality:", error);
    return res.status(500).json({
      error: "Failed to verify originality",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
