/**
 * Plan Enforcement Middleware
 * Server-side helpers for API routes to check plan access and usage limits.
 */

import { NextResponse } from 'next/server';
import { PlanTier, PlanFeatures, PlanLimits, hasFeature, isWithinLimit, getLimit, formatLimit, getMinimumPlanForFeature } from './feature-gates';

interface EnforceResult {
  allowed: boolean;
  response?: NextResponse;
}

/**
 * Check if the user's plan has access to a feature.
 * Returns 403 with upgrade CTA if not allowed.
 */
export function enforceFeature(
  plan: PlanTier,
  feature: keyof PlanFeatures,
  featureLabel?: string
): EnforceResult {
  if (hasFeature(plan, feature)) {
    return { allowed: true };
  }

  const minimumPlan = getMinimumPlanForFeature(feature);
  const label = featureLabel ?? feature;

  return {
    allowed: false,
    response: NextResponse.json(
      {
        error: 'feature_locked',
        message: `${label} requires the ${minimumPlan.charAt(0).toUpperCase() + minimumPlan.slice(1)} plan or higher.`,
        currentPlan: plan,
        requiredPlan: minimumPlan,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 403 }
    ),
  };
}

/**
 * Check if the user is within their usage limit for a resource.
 * Returns 429 with upgrade CTA if limit exceeded.
 */
export function enforceLimit(
  plan: PlanTier,
  resource: keyof PlanLimits,
  currentUsage: number,
  resourceLabel?: string
): EnforceResult {
  if (isWithinLimit(plan, resource, currentUsage)) {
    return { allowed: true };
  }

  const limit = getLimit(plan, resource);
  const label = resourceLabel ?? resource;

  return {
    allowed: false,
    response: NextResponse.json(
      {
        error: 'limit_exceeded',
        message: `You've reached your monthly limit of ${formatLimit(limit)} ${label}. Upgrade your plan for more.`,
        currentPlan: plan,
        currentUsage,
        limit,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 429 }
    ),
  };
}

/**
 * Combined feature + limit check.
 * First checks feature access, then limit.
 */
export function enforceAccess(
  plan: PlanTier,
  feature: keyof PlanFeatures,
  resource: keyof PlanLimits,
  currentUsage: number,
  labels?: { feature?: string; resource?: string }
): EnforceResult {
  const featureCheck = enforceFeature(plan, feature, labels?.feature);
  if (!featureCheck.allowed) return featureCheck;

  return enforceLimit(plan, resource, currentUsage, labels?.resource);
}
