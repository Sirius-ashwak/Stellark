// Backend Entry Point

import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import parseLicenseRouter from "./routes/parseLicense";
import registerIPRouter from "./routes/registerIP";
import verifyOriginalityRouter from "./routes/verifyOriginality";
import classifyUsageRouter from "./routes/classifyUsage";

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/parse-license", parseLicenseRouter);
app.use("/api/register-ip", registerIPRouter);
app.use("/api/verify-originality", verifyOriginalityRouter);
app.use("/api/classify-usage", classifyUsageRouter);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Stellark API",
    version: "1.0.0",
    description: "IP Rights Management on Story Protocol",
    endpoints: {
      "POST /api/parse-license": "Parse license text into Stellark Rights Schema",
      "POST /api/register-ip": "Register IP Asset on Story Protocol",
      "POST /api/verify-originality": "Verify content originality (MOCK)",
      "POST /api/classify-usage": "Classify usage against rights schema",
      "GET /health": "Health check",
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   Stellark API Server                                     ║
  ║                                                           ║
  ║   Running on: http://localhost:${PORT}                      ║
  ║   Environment: ${process.env.NODE_ENV || "development"}                         ║
  ║                                                           ║
  ║   Endpoints:                                              ║
  ║   • POST /api/parse-license                               ║
  ║   • POST /api/register-ip                                 ║
  ║   • POST /api/verify-originality (MOCK)                   ║
  ║   • POST /api/classify-usage                              ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
