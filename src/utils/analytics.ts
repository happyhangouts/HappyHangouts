/**
 * Google Analytics (GA4) & Tracking Helper for Happy Hangouts
 * Safely initializes gtag.js and dispatches conversion events.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = 
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-HAPPYHANGOUT";

let isInitialized = false;

/**
 * Initialize Google tag (gtag.js)
 */
export function initGoogleAnalytics(): void {
  if (typeof window === "undefined" || isInitialized) return;

  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
      cookie_flags: "SameSite=None;Secure",
      anonymize_ip: true
    });

    // Check if script already exists
    const existingScript = document.getElementById("google-analytics-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-analytics-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    isInitialized = true;
    console.debug(`[GA4] Initialized tracking with ID: ${GA_MEASUREMENT_ID}`);
  } catch (err) {
    console.warn("[GA4] Initialization error:", err);
  }
}

/**
 * Generic Event Tracker
 */
export function trackEvent(
  action: string,
  category: string = "engagement",
  label?: string,
  value?: number,
  params?: Record<string, any>
): void {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event_category: category,
    event_label: label,
    value: value,
    ...params
  };

  if (window.gtag) {
    window.gtag("event", action, eventPayload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      ...eventPayload
    });
  }

  console.debug(`[GA4] Event tracked: ${action}`, eventPayload);
}

/**
 * Page View Tracker
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  if (typeof window === "undefined") return;

  const path = pagePath || window.location.pathname + window.location.hash;
  const title = pageTitle || document.title;

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    });
  }
}

/**
 * Specialized conversion event helpers
 */
export const analytics = {
  // Companion booking initiation
  trackBookingClick: (companionName: string, location: string, rate: number = 0) => {
    trackEvent("begin_checkout", "ecommerce", `${companionName} @ ${location}`, rate, {
      companion_name: companionName,
      meeting_location: location,
      is_free_hangout: true,
      currency: "INR"
    });
  },

  // 1st hangout free perk view
  trackFreeHangoutsPerkView: () => {
    trackEvent("view_promotion", "promotions", "1st Hangout Free Offer", 0, {
      promotion_name: "launch_1st_hangout_free",
      discount: 100
    });
  },

  // Hotspot radar / map exploration
  trackHotspotInspect: (spotName: string, city: string, activeCount: number) => {
    trackEvent("select_content", "radar_map", `${spotName} (${city})`, activeCount, {
      content_type: "hangout_hotspot",
      hotspot_name: spotName,
      city: city,
      active_companions: activeCount
    });
  },

  // Map view toggle (Google Maps vs Sonar)
  trackViewModeSwitch: (mode: "map" | "radar") => {
    trackEvent("view_mode_switch", "interaction", mode, 1, {
      view_mode: mode
    });
  },

  // Lead / Waitlist form submission
  trackLeadSubmit: (role: string, preferredCity: string, hasWhatsApp: boolean) => {
    trackEvent("generate_lead", "conversion", role, 1, {
      user_role: role,
      city: preferredCity,
      whatsapp_verified: hasWhatsApp
    });
  },

  // Audio mute/unmute
  trackAudioToggle: (isMuted: boolean) => {
    trackEvent("sound_toggle", "interaction", isMuted ? "muted" : "unmuted");
  }
};
