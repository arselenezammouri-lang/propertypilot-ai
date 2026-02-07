/**
 * Analytics Tracking - Event tracking per PropertyPilot AI
 * 
 * Supporta:
 * - Google Analytics 4 (opzionale)
 * - Custom event tracking
 * - User behavior tracking
 */

type EventName = 
  | 'page_view'
  | 'feature_used'
  | 'listing_generated'
  | 'lead_created'
  | 'subscription_upgraded'
  | 'checkout_started'
  | 'checkout_completed'
  | 'demo_booked'
  | 'error_occurred'
  | 'api_call'
  | 'ai_generation'
  | 'voice_call_initiated';

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Track event (client-side)
 */
export function trackEvent(eventName: EventName, properties?: EventProperties) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 (se configurato)
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Custom analytics (puoi aggiungere altri provider qui)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }

  // Invia a API endpoint per tracking server-side (opzionale)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, properties }),
    }).catch(() => {
      // Silently fail - analytics non deve bloccare l'app
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  trackEvent('page_view', {
    path,
    title: title || document.title,
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsed(featureName: string, metadata?: EventProperties) {
  trackEvent('feature_used', {
    feature: featureName,
    ...metadata,
  });
}

/**
 * Track AI generation
 */
export function trackAIGeneration(
  type: 'listing' | 'copy' | 'email' | 'social' | 'other',
  success: boolean,
  duration?: number
) {
  trackEvent('ai_generation', {
    type,
    success,
    duration,
  });
}

/**
 * Track subscription events
 */
export function trackSubscription(event: 'upgraded' | 'downgraded' | 'cancelled', plan: string) {
  trackEvent('subscription_upgraded', {
    event,
    plan,
  });
}

// Type declaration per gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
