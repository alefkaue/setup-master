const STORE_CONFIGS: Record<string, { paramName: string; baseUrl?: string }> = {
  amazon: { paramName: 'tag' },
  kabum: { paramName: 'parceiro' },
  terabyte: { paramName: 'aff' },
  aliexpress: { paramName: 'aff_id' },
  mercadolivre: { paramName: 'aff' },
  pichau: { paramName: 'aff' },
};

export function generateAffiliateLink(
  originalUrl: string,
  storeSlug: string,
  partnerCode: string | null
): string {
  if (!partnerCode) return originalUrl;
  
  const config = STORE_CONFIGS[storeSlug.toLowerCase()];
  if (!config) return originalUrl;

  try {
    const url = new URL(originalUrl);
    url.searchParams.set(config.paramName, partnerCode);
    return url.toString();
  } catch {
    // If URL is invalid, return original
    return originalUrl;
  }
}

export function getPartnerSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('p') || params.get('partner');
}

export function savePartnerSession(slug: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('partner_slug', slug);
  localStorage.setItem('partner_timestamp', Date.now().toString());
}

export function getStoredPartnerSlug(): string | null {
  if (typeof window === 'undefined') return null;
  
  const slug = localStorage.getItem('partner_slug');
  const timestamp = localStorage.getItem('partner_timestamp');
  
  if (!slug || !timestamp) return null;
  
  // Partner cookie expires after 30 days
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - parseInt(timestamp) > thirtyDays) {
    localStorage.removeItem('partner_slug');
    localStorage.removeItem('partner_timestamp');
    return null;
  }
  
  return slug;
}
