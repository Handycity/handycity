/**
 * Brand logo and emoji lookups, shared by Brands.astro and PriceCalculator.astro.
 *
 * The calculator needs these in the browser (Alpine renders brand buttons from
 * the price data), so the logo map is built from a base URL rather than
 * importing the asset, and the fallback emoji covers brands present in the
 * price table that have no SVG.
 */

const BRAND_LOGO_FILES = {
  Apple: 'apple.svg',
  Samsung: 'samsung.svg',
  Huawei: 'huawei.svg',
  Xiaomi: 'xiaomi.svg',
  OnePlus: 'oneplus.svg',
  Google: 'google.svg',
  Sony: 'sony.svg',
  Nokia: 'nokia.svg'
};

const BRAND_EMOJI = {
  Apple: '🍎',
  Samsung: '📱',
  Huawei: '🌐',
  Xiaomi: '🔧',
  OnePlus: '⚡',
  Google: '🔍',
  Sony: '🎮',
  Nokia: '📞'
};

export const FALLBACK_BRAND_EMOJI = '📱';

/** Intrinsic size of the brand SVGs; all share a 24x24 viewBox. */
export const BRAND_LOGO_SIZE = 24;

/** @returns {Record<string, string>} brand name -> logo URL */
export function buildBrandLogoMap(baseUrl) {
  return Object.fromEntries(
    Object.entries(BRAND_LOGO_FILES).map(([brand, file]) => [brand, `${baseUrl}brands/${file}`])
  );
}

export function brandEmojiFor(brand) {
  return BRAND_EMOJI[brand] ?? FALLBACK_BRAND_EMOJI;
}

export { BRAND_EMOJI };
