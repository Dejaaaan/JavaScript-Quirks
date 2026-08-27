export type Theme = 'light' | 'dark';

/**
 * Derives the top shared root domain so cookies are shared across all subdomains
 * (e.g. javascript.quirks.dpdns.org and quirks.dpdns.org share .quirks.dpdns.org).
 */
export function getSharedCookieDomain(hostname: string = typeof window !== 'undefined' ? window.location.hostname : ''): string {
  if (!hostname || hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return '';
  }

  // Specifically check for *.quirks.dpdns.org domain family
  if (hostname === 'quirks.dpdns.org' || hostname.endsWith('.quirks.dpdns.org')) {
    return '.quirks.dpdns.org';
  }

  const parts = hostname.split('.');
  // For domains with multiple subdomains, share across the primary subdomain root
  if (parts.length >= 3) {
    return '.' + parts.slice(-3).join('.');
  }
  if (parts.length === 2) {
    return '.' + hostname;
  }
  return '';
}

/**
 * Reads a cookie value by name.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sets a cookie across all subdomains (with 1-year persistence and SameSite=Lax).
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;

  const maxAge = days * 24 * 60 * 60;
  const domain = getSharedCookieDomain();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  const domainAttr = domain ? `; Domain=${domain}` : '';
  
  // Set shared domain cookie
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${domainAttr}${secure}`;
}

/**
 * Retrieves the stored theme setting from Cookie (or LocalStorage as fallback).
 */
export function getStoredTheme(): Theme | null {
  try {
    // 1. Check Cookie first for cross-subdomain synchronization
    const cookieTheme = getCookie('theme');
    if (cookieTheme === 'dark' || cookieTheme === 'light') {
      return cookieTheme;
    }

    // 2. Check LocalStorage fallback
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('theme');
      if (localTheme === 'dark' || localTheme === 'light') {
        return localTheme;
      }
      const legacyTheme = localStorage.getItem('js_quirks_dark_mode');
      if (legacyTheme === 'true') return 'dark';
      if (legacyTheme === 'false') return 'light';
    }
  } catch (e) {
    console.warn('Could not read stored theme:', e);
  }

  return null;
}

/**
 * Persists the theme both in a cross-subdomain Cookie and in LocalStorage.
 */
export function saveTheme(theme: Theme): void {
  try {
    // Save to shared cookie (.quirks.dpdns.org)
    setCookie('theme', theme);

    // Also synchronize LocalStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  } catch (e) {
    console.warn('Could not persist theme:', e);
  }
}
