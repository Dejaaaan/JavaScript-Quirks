import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  /**
   * Google AdSense ad slot ID (e.g., '1234567890').
   * If omitted, falls back to VITE_ADSENSE_SLOT_ID or preview placeholder mode.
   */
  slotId?: string;
  /**
   * Custom AdSense client publisher ID (e.g., 'ca-pub-1234567890123456').
   * If omitted, defaults to VITE_ADSENSE_CLIENT_ID.
   */
  clientId?: string;
  /**
   * Ad layout format:
   * - 'auto': Responsive rectangular/horizontal container
   * - 'horizontal': Wide leaderboard banner (e.g. 728x90 or fluid)
   * - 'rectangle': Standard box (e.g. 300x250, 336x280)
   * - 'in-feed': Native styled in-feed card matching topic cards
   */
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-feed';
  /**
   * Whether to allow AdSense full width responsive expansion.
   */
  responsive?: boolean;
  /**
   * Optional custom CSS class name for the wrapper.
   */
  className?: string;
  /**
   * Explicit label override (e.g., 'Advertisement' or 'Sponsored').
   */
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * Production-ready Google AdSense container with built-in:
 * 1. Cumulative Layout Shift (CLS) prevention via min-height bounds.
 * 2. Theme-aware dark/light contrast styling.
 * 3. Dynamic script injection when valid client ID is detected.
 * 4. Graceful fallback/preview placeholder when credentials are in dev or unconfigured.
 * 5. Safe single-execution adsbygoogle.push({}).
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  clientId,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Sponsored'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isPushed = useRef(false);
  const [adError, setAdError] = useState(false);

  const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env || {};
  const activeClientId = (clientId || metaEnv.VITE_ADSENSE_CLIENT_ID || 'ca-pub-6816887029574421').trim();
  const activeSlotId = (slotId || metaEnv.VITE_ADSENSE_SLOT_ID || '').trim();

  // Determine whether we are in a live production environment with valid Google publisher ID
  const isLiveConfigured = 
    Boolean(activeClientId) && 
    activeClientId.startsWith('ca-pub-') && 
    !activeClientId.includes('XXXX') &&
    Boolean(activeSlotId) &&
    !activeSlotId.includes('XXXX');

  useEffect(() => {
    if (!isLiveConfigured) return;

    // Dynamically inject the official AdSense script tag if not already present
    const SCRIPT_ID = 'google-adsense-script';
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activeClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (isPushed.current) return;

    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (err) {
      console.warn('[AdSense] Initialization note:', err);
      setAdError(true);
    }
  }, [isLiveConfigured, activeClientId, activeSlotId]);

  // Height and aspect styling based on target format
  const getContainerStyle = () => {
    switch (format) {
      case 'horizontal':
        return 'min-h-[90px] sm:min-h-[100px] max-w-4xl py-3';
      case 'rectangle':
        return 'min-h-[250px] sm:min-h-[280px] max-w-sm py-4';
      case 'in-feed':
        return 'min-h-[160px] sm:min-h-[190px] w-full p-5';
      case 'auto':
      default:
        return 'min-h-[120px] sm:min-h-[250px] max-w-3xl py-4';
    }
  };

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 flex flex-col items-center justify-center transition-all ${className}`}
    >
      {/* Discreet Compliance / Label Header */}
      <div className="flex items-center gap-2 mb-1.5 opacity-70">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717A] dark:text-[#A1A1AA]">
          {label}
        </span>
      </div>

      {/* Ad Card Container */}
      <div
        ref={adRef}
        className={`w-full bg-[#FAF9F5] dark:bg-[#1E1E22] border border-[#E5E5DF] dark:border-[#2E2E33] rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xs ${getContainerStyle()}`}
      >
        {isLiveConfigured && !adError ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', textAlign: 'center' }}
            data-ad-client={activeClientId}
            data-ad-slot={activeSlotId}
            data-ad-format={format === 'in-feed' ? 'fluid' : format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        ) : (
          /* Elegant placeholder for preview and development */
          <div className="w-full flex flex-col items-center justify-center px-4 py-6 text-center space-y-2 select-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EBEBE5] dark:bg-[#2A2A2E] text-[#575750] dark:text-[#A1A1AA] text-[11px] font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-[#B45309] dark:bg-[#F59E0B] animate-pulse"></span>
              <span>Google AdSense Placement ({format})</span>
            </div>
            <p className="text-xs text-[#575750] dark:text-[#A1A1AA] max-w-md font-sans">
              Configured for targeted developer tools & cloud sponsors. Set{' '}
              <code className="text-[11px] font-mono text-[#B45309] dark:text-[#FCD34D]">
                VITE_ADSENSE_CLIENT_ID
              </code>{' '}
              to activate live ad serving.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
