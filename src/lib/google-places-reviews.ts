interface GooglePlacesReview {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
}

interface GooglePlacesDetailsResponse {
  status: string;
  error_message?: string;
  result?: {
    url?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GooglePlacesReview[];
  };
}

export interface ReviewItem {
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface LiveReviewsData {
  googleUrl: string;
  averageRating: number;
  totalReviews: number;
  items: ReviewItem[];
}

interface FetchGoogleReviewsParams {
  apiKey?: string;
  placeId?: string;
  placeQuery?: string;
  latitude?: number;
  longitude?: number;
  language?: string;
  maxItems?: number;
}

const GOOGLE_PLACE_DETAILS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/details/json';
const GOOGLE_FIND_PLACE_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

function clampRating(rating?: number): number {
  if (!Number.isFinite(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating as number)));
}

function formatReviewDate(unixSeconds?: number, locale = 'de-AT'): string {
  if (!Number.isFinite(unixSeconds)) return '';
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date((unixSeconds as number) * 1000)
  );
}

function normalizeText(text?: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

interface GoogleFindPlaceResponse {
  status: string;
  error_message?: string;
  candidates?: Array<{
    place_id?: string;
  }>;
}

async function resolvePlaceId({
  apiKey,
  placeId,
  placeQuery,
  latitude,
  longitude,
  language
}: FetchGoogleReviewsParams): Promise<string | null> {
  if (placeId) return placeId;
  if (!apiKey || !placeQuery) return null;

  const endpoint = new URL(GOOGLE_FIND_PLACE_ENDPOINT);
  endpoint.searchParams.set('key', apiKey);
  endpoint.searchParams.set('input', placeQuery);
  endpoint.searchParams.set('inputtype', 'textquery');
  endpoint.searchParams.set('fields', 'place_id');
  endpoint.searchParams.set('language', language || 'de');

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    endpoint.searchParams.set('locationbias', `point:${latitude},${longitude}`);
  }

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Google Find Place request failed (${response.status})`);
  }

  const payload = (await response.json()) as GoogleFindPlaceResponse;
  if (payload.status !== 'OK') {
    throw new Error(payload.error_message || `Google Find Place status: ${payload.status}`);
  }

  return payload.candidates?.[0]?.place_id?.trim() || null;
}

export async function fetchGoogleReviews({
  apiKey,
  placeId,
  placeQuery,
  latitude,
  longitude,
  language = 'de',
  maxItems = 6
}: FetchGoogleReviewsParams): Promise<LiveReviewsData | null> {
  if (!apiKey) return null;

  const resolvedPlaceId = await resolvePlaceId({
    apiKey,
    placeId,
    placeQuery,
    latitude,
    longitude,
    language
  });
  if (!resolvedPlaceId) return null;

  const endpoint = new URL(GOOGLE_PLACE_DETAILS_ENDPOINT);
  endpoint.searchParams.set('key', apiKey);
  endpoint.searchParams.set('place_id', resolvedPlaceId);
  endpoint.searchParams.set('language', language);
  endpoint.searchParams.set('reviews_sort', 'newest');
  endpoint.searchParams.set('fields', 'url,rating,user_ratings_total,reviews');

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed (${response.status})`);
  }

  const payload = (await response.json()) as GooglePlacesDetailsResponse;
  if (payload.status !== 'OK' || !payload.result) {
    throw new Error(payload.error_message || `Google Places status: ${payload.status}`);
  }

  const reviews = Array.isArray(payload.result.reviews) ? payload.result.reviews : [];
  const locale = language === 'de' ? 'de-AT' : 'en-US';

  const items = reviews
    .slice(0, maxItems)
    .map((review, index) => {
      const text = normalizeText(review.text);
      return {
        name: review.author_name?.trim() || `Google Nutzer ${index + 1}`,
        text,
        rating: clampRating(review.rating),
        date: review.relative_time_description?.trim() || formatReviewDate(review.time, locale)
      };
    })
    .filter((review) => review.text.length > 0);

  const googleUrl =
    payload.result.url?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resolvedPlaceId)}`;

  return {
    googleUrl,
    averageRating: Number(payload.result.rating || 0),
    totalReviews: Number(payload.result.user_ratings_total || 0),
    items
  };
}
