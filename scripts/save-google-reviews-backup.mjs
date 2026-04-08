import fs from 'node:fs/promises';

const CONTENT_PATH = 'src/data/content.yaml';
const MAX_ITEMS = Number.parseInt(process.env.GOOGLE_REVIEWS_MAX_ITEMS || '6', 10);
const DEFAULT_QUERY = 'Handycity, Kardinalplatz 6, 9020 Klagenfurt am Wörthersee';

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

function clampRating(rating) {
  if (!Number.isFinite(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating)));
}

function sanitizeText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function toYamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function formatDate(unixSeconds, relative, language) {
  if (relative && relative.trim()) return relative.trim();
  if (!Number.isFinite(unixSeconds)) return '';
  const locale = language === 'de' ? 'de-AT' : 'en-US';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(unixSeconds * 1000));
}

async function resolvePlaceId({ apiKey, placeId, query, language }) {
  if (placeId) return placeId;

  const endpoint = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  endpoint.searchParams.set('key', apiKey);
  endpoint.searchParams.set('input', query);
  endpoint.searchParams.set('inputtype', 'textquery');
  endpoint.searchParams.set('fields', 'place_id');
  endpoint.searchParams.set('language', language);

  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    exitWithError(`Google Find Place failed (${response.status}).`);
  }

  const payload = await response.json();
  if (payload.status !== 'OK' || !payload.candidates?.length) {
    exitWithError(payload.error_message || `Google Find Place status: ${payload.status}`);
  }

  return payload.candidates[0].place_id;
}

function buildReviewsBlock({
  headline,
  googleUrl,
  averageRating,
  totalReviews,
  items
}) {
  const lines = [
    '# ------ Reviews / Google Bewertungen ------',
    'reviews:',
    `  headline: ${toYamlString(headline)}`,
    `  googleUrl: ${toYamlString(googleUrl)}`,
    `  averageRating: ${Number.isFinite(averageRating) ? Number(averageRating.toFixed(1)) : 0}`,
    `  totalReviews: ${Number.isFinite(totalReviews) ? Math.max(0, Math.round(totalReviews)) : 0}`
  ];

  if (!items.length) {
    lines.push('  items: []');
    return lines.join('\n');
  }

  lines.push('  items:');
  for (const item of items) {
    lines.push(`    - name: ${toYamlString(item.name)}`);
    lines.push(`      text: ${toYamlString(item.text)}`);
    lines.push(`      rating: ${item.rating}`);
    lines.push(`      date: ${toYamlString(item.date)}`);
  }

  return lines.join('\n');
}

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const language = process.env.GOOGLE_LANGUAGE || 'de';
  const placeId = process.env.GOOGLE_PLACE_ID || '';
  const query = process.env.GOOGLE_PLACE_QUERY || DEFAULT_QUERY;

  if (!apiKey) {
    exitWithError('GOOGLE_PLACES_API_KEY is missing. Set it for this one-time backup fetch.');
  }

  const resolvedPlaceId = await resolvePlaceId({ apiKey, placeId, query, language });

  const detailsEndpoint = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  detailsEndpoint.searchParams.set('key', apiKey);
  detailsEndpoint.searchParams.set('place_id', resolvedPlaceId);
  detailsEndpoint.searchParams.set('language', language);
  detailsEndpoint.searchParams.set('reviews_sort', 'newest');
  detailsEndpoint.searchParams.set('fields', 'url,rating,user_ratings_total,reviews');

  const detailsResponse = await fetch(detailsEndpoint, { headers: { Accept: 'application/json' } });
  if (!detailsResponse.ok) {
    exitWithError(`Google Place Details failed (${detailsResponse.status}).`);
  }

  const details = await detailsResponse.json();
  if (details.status !== 'OK' || !details.result) {
    exitWithError(details.error_message || `Google Place Details status: ${details.status}`);
  }

  const sourceReviews = Array.isArray(details.result.reviews) ? details.result.reviews : [];
  const items = sourceReviews
    .slice(0, MAX_ITEMS)
    .map((review, index) => {
      const text = sanitizeText(review.text);
      return {
        name: review.author_name?.trim() || `Google Nutzer ${index + 1}`,
        text,
        rating: clampRating(review.rating),
        date: formatDate(review.time, review.relative_time_description, language)
      };
    })
    .filter((item) => item.text.length > 0);

  const content = await fs.readFile(CONTENT_PATH, 'utf8');
  const reviewsBlock = buildReviewsBlock({
    headline: 'Das sagen unsere Kunden',
    googleUrl: details.result.url || 'https://www.google.com/maps/place/Handycity+Klagenfurt/',
    averageRating: Number(details.result.rating || 0),
    totalReviews: Number(details.result.user_ratings_total || 0),
    items
  });

  const updated = content.replace(
    /# ------ Reviews \/ Google Bewertungen ------[\s\S]*?# ------ Repair Price Calculator ------/,
    `${reviewsBlock}\n\n# ------ Repair Price Calculator ------`
  );

  if (updated === content) {
    exitWithError('Could not locate reviews section in src/data/content.yaml.');
  }

  await fs.writeFile(CONTENT_PATH, updated, 'utf8');
  console.log(
    `Saved Google backup reviews: ${items.length} items, rating ${Number(details.result.rating || 0)}, total ${Number(details.result.user_ratings_total || 0)}`
  );
}

main().catch((error) => {
  exitWithError(`Backup sync failed: ${error instanceof Error ? error.message : String(error)}`);
});
