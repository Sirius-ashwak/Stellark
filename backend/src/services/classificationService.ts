// Classification Service - Usage rights classification

import { RightsSchema, UsageContext, ClassificationResult } from "../types";
import { COMMERCIAL_DOMAINS } from "../utils/constants";

export function classifyUsage(
  schema: RightsSchema,
  context: UsageContext
): ClassificationResult {
  const violations: string[] = [];

  // Check commercial use
  if (!schema.allowCommercialUse) {
    if (context.useType === "commercial") {
      violations.push("Commercial use not allowed");
    }
    // Check if domain is a known commercial platform
    if (COMMERCIAL_DOMAINS.some((d) => context.domain.includes(d))) {
      violations.push(`Domain '${context.domain}' indicates commercial use which is not allowed`);
    }
  }

  // Check derivatives
  if (!schema.allowDerivatives && context.useType === "derivative") {
    violations.push("Derivative works not allowed");
  }

  // Check prohibited uses
  const matchedProhibited = schema.prohibitedUses.filter((use) =>
    context.useType.toLowerCase().includes(use.toLowerCase())
  );
  if (matchedProhibited.length > 0) {
    violations.push(`Use type '${context.useType}' matches prohibited uses: ${matchedProhibited.join(", ")}`);
  }

  // Check allowed platforms (if specified)
  if (schema.allowedPlatforms.length > 0) {
    const isAllowed = schema.allowedPlatforms.some((platform) =>
      context.domain.includes(platform)
    );
    if (!isAllowed) {
      violations.push(`Platform '${context.domain}' not in allowed list: ${schema.allowedPlatforms.join(", ")}`);
    }
  }

  // Check territory (basic check)
  if (schema.territory.length > 0 && !schema.territory.includes("worldwide")) {
    violations.push(`Territory restrictions apply: ${schema.territory.join(", ")} - verify compliance`);
  }

  // Determine classification
  if (violations.length > 0) {
    return {
      classification: "Likely Violation",
      reason: violations.join("; "),
    };
  }

  // Check if attribution is required
  if (schema.attributionRequired) {
    return {
      classification: "Likely Permitted",
      reason: "Usage appears to comply with rights schema. Note: Attribution is required.",
    };
  }

  return {
    classification: "Likely Permitted",
    reason: "Usage appears to comply with rights schema",
  };
}

// Batch classification for multiple contexts
export function classifyMultipleUsages(
  schema: RightsSchema,
  contexts: UsageContext[]
): Array<{ context: UsageContext; result: ClassificationResult }> {
  return contexts.map((context) => ({
    context,
    result: classifyUsage(schema, context),
  }));
}

// Get usage recommendations based on rights schema
export function getUsageRecommendations(schema: RightsSchema): string[] {
  const recommendations: string[] = [];

  if (schema.allowCommercialUse) {
    recommendations.push("✓ Commercial use is permitted");
  } else {
    recommendations.push("✗ Commercial use is NOT permitted");
  }

  if (schema.allowDerivatives) {
    recommendations.push("✓ Derivative works are permitted");
    if (schema.shareAlike) {
      recommendations.push("  → Derivatives must use the same license (ShareAlike)");
    }
  } else {
    recommendations.push("✗ Derivative works are NOT permitted");
  }

  if (schema.attributionRequired) {
    recommendations.push("⚠ Attribution is required");
  }

  if (schema.royaltyRateBps > 0) {
    const percentage = schema.royaltyRateBps / 100;
    recommendations.push(`💰 Royalty payment required: ${percentage}%`);
  }

  if (schema.territory.length > 0 && !schema.territory.includes("worldwide")) {
    recommendations.push(`🌍 Limited to territories: ${schema.territory.join(", ")}`);
  }

  if (schema.prohibitedUses.length > 0) {
    recommendations.push(`🚫 Prohibited uses: ${schema.prohibitedUses.join(", ")}`);
  }

  if (schema.allowedPlatforms.length > 0) {
    recommendations.push(`📱 Allowed platforms only: ${schema.allowedPlatforms.join(", ")}`);
  }

  return recommendations;
}
