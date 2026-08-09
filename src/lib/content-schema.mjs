import { z } from 'zod';

/**
 * The single description of what the content store must contain.
 *
 * This replaces a hand-written validator that only covered part of the tree,
 * which is how fields with no consumer (and consumers with no field) drifted
 * apart. Every section a component reads is described here, so a workflow that
 * removes a key fails the build instead of rendering `undefined` to a customer.
 *
 * Kept in .mjs so the Node scripts and the Astro build share one copy;
 * src/lib/content-types.ts re-exports the inferred TypeScript types.
 */

const nonEmpty = (label) => z.string().trim().min(1, `${label} must not be empty`);

/** Links the owner may edit: absolute, mail/tel, or an in-page anchor. */
const linkish = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => /^(https?:\/\/|mailto:|tel:|#|\/)/.test(value),
    'must start with https://, http://, mailto:, tel:, / or #'
  );

const iconName = nonEmpty('icon');

const hoursEntry = z.object({
  day: nonEmpty('day'),
  time: nonEmpty('time'),
  shortDay: nonEmpty('shortDay')
});

const cta = z.object({ text: nonEmpty('text'), href: linkish });

const site = z.object({
  title: nonEmpty('title'),
  description: nonEmpty('description'),
  url: linkish,
  locale: nonEmpty('locale'),
  language: nonEmpty('language')
});

const company = z.object({
  name: nonEmpty('name'),
  legalName: nonEmpty('legalName'),
  phone: nonEmpty('phone'),
  phoneDisplay: nonEmpty('phoneDisplay'),
  email: z.email(),
  address: z.object({
    street: nonEmpty('street'),
    city: nonEmpty('city'),
    zip: nonEmpty('zip'),
    country: nonEmpty('country')
  }),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  map: z.object({ placeUrl: linkish })
});

const hero = z.object({
  kicker: nonEmpty('kicker'),
  headline: nonEmpty('headline'),
  subheadline: nonEmpty('subheadline'),
  ctaPrimary: cta,
  ctaSecondary: cta,
  quickContactHeadline: nonEmpty('quickContactHeadline'),
  quickContactText: nonEmpty('quickContactText'),
  quickContactNote: nonEmpty('quickContactNote'),
  trustBadges: z.array(z.object({ text: nonEmpty('text') })).min(1)
});

const trustBar = z.object({
  googleLabel: nonEmpty('googleLabel'),
  googleHint: nonEmpty('googleHint'),
  items: z.array(z.object({
    title: nonEmpty('title'),
    text: nonEmpty('text'),
    icon: iconName
  })).min(1)
});

// `description` and `price` are currently rendered nowhere (ServicesHub shows
// only `name`). They stay required so the existing content keeps validating;
// see docs/CODE_REVIEW.md section 5.1 for the open decision.
const services = z.object({
  headline: nonEmpty('headline'),
  subheadline: nonEmpty('subheadline'),
  items: z.array(z.object({
    name: nonEmpty('name'),
    description: nonEmpty('description'),
    icon: iconName,
    price: z.string()
  })).min(1)
});

const trust = z.object({
  kicker: nonEmpty('kicker'),
  headline: nonEmpty('headline'),
  intro: nonEmpty('intro'),
  items: z.array(z.object({
    title: nonEmpty('title'),
    description: nonEmpty('description'),
    icon: iconName
  })).min(1)
});

const location = z.object({
  kicker: nonEmpty('kicker'),
  headline: nonEmpty('headline'),
  intro: nonEmpty('intro'),
  addressNote: nonEmpty('addressNote'),
  consentTitle: nonEmpty('consentTitle'),
  consentText: nonEmpty('consentText'),
  consentButton: nonEmpty('consentButton')
});

const contact = z.object({
  headline: nonEmpty('headline'),
  subheadline: nonEmpty('subheadline'),
  visitLabel: nonEmpty('visitLabel'),
  fields: z.array(z.object({
    name: nonEmpty('name'),
    label: nonEmpty('label'),
    type: z.enum(['text', 'email', 'tel', 'textarea']),
    required: z.boolean()
  })).min(1)
});

const reviews = z.object({
  headline: nonEmpty('headline'),
  googleUrl: linkish,
  averageRating: z.number().min(0).max(5),
  totalReviews: z.number().int().min(0),
  items: z.array(z.object({
    name: nonEmpty('name'),
    text: nonEmpty('text'),
    rating: z.number().min(1).max(5),
    date: nonEmpty('date')
  }))
});

const priceEntry = z.object({
  brand: nonEmpty('brand'),
  device: nonEmpty('device'),
  repair: nonEmpty('repair'),
  price: nonEmpty('price')
});

const calculator = z.object({
  headline: nonEmpty('headline'),
  subheadline: nonEmpty('subheadline'),
  prices: z.array(priceEntry).min(1)
});

const geraeteRetterPraemie = z.object({
  headline: nonEmpty('headline'),
  subheadline: nonEmpty('subheadline'),
  description: nonEmpty('description'),
  highlights: z.array(nonEmpty('highlight')).min(1),
  bonusUrl: linkish,
  domainLabel: nonEmpty('domainLabel'),
  teaser: z.object({
    title: nonEmpty('title'),
    text: nonEmpty('text'),
    linkText: nonEmpty('linkText')
  }),
  ctaText: nonEmpty('ctaText'),
  ctaHref: linkish,
  steps: z.array(z.object({
    step: nonEmpty('step'),
    title: nonEmpty('title'),
    description: nonEmpty('description')
  })).min(1)
});

const willhaben = z.object({
  headline: nonEmpty('headline'),
  description: nonEmpty('description'),
  highlights: z.array(nonEmpty('highlight')).min(1),
  verifiedOn: z.string(),
  url: linkish,
  ctaText: nonEmpty('ctaText'),
  contactCtaText: z.string().optional(),
  offers: z.array(z.object({
    title: nonEmpty('title'),
    price: nonEmpty('price'),
    url: linkish,
    image: linkish,
    imageAlt: nonEmpty('imageAlt'),
    listedAt: nonEmpty('listedAt'),
    storage: nonEmpty('storage'),
    unlocked: nonEmpty('unlocked'),
    condition: nonEmpty('condition'),
    delivery: nonEmpty('delivery'),
    note: z.string().optional()
  }))
});

const legalPage = z.object({
  headline: nonEmpty('headline'),
  content: nonEmpty('content')
});

export const contentSchema = z
  .object({
    site,
    company,
    hours: z.array(hoursEntry).min(1),
    social: z.record(z.string(), linkish),
    hero,
    trustBar,
    services,
    brands: z.object({
      headline: nonEmpty('headline'),
      items: z.array(nonEmpty('brand')).min(1)
    }),
    trust,
    process: z.object({
      headline: nonEmpty('headline'),
      steps: z.array(z.object({
        step: nonEmpty('step'),
        title: nonEmpty('title'),
        description: nonEmpty('description'),
        icon: iconName
      })).min(1)
    }),
    location,
    contact,
    reviews,
    calculator,
    geraeteRetterPraemie,
    willhaben,
    faq: z.object({
      headline: nonEmpty('headline'),
      items: z.array(z.object({
        question: nonEmpty('question'),
        answer: nonEmpty('answer')
      }))
    }),
    impressum: legalPage,
    datenschutz: legalPage
  })
  .superRefine((content, ctx) => {
    // Cross-field rules Zod cannot express structurally.
    const seenService = new Set();
    for (const [index, item] of content.services.items.entries()) {
      const key = item.name.trim().toLowerCase();
      if (seenService.has(key)) {
        ctx.addIssue({
          code: 'custom',
          path: ['services', 'items', index, 'name'],
          message: `duplicate service name "${item.name}"`
        });
      }
      seenService.add(key);
    }

    const seenPrice = new Set();
    for (const [index, item] of content.calculator.prices.entries()) {
      const key = [item.brand, item.device, item.repair]
        .map((part) => part.trim().toLowerCase())
        .join('::');
      if (seenPrice.has(key)) {
        ctx.addIssue({
          code: 'custom',
          path: ['calculator', 'prices', index],
          message: `duplicate price entry ${item.brand} / ${item.device} / ${item.repair}`
        });
      }
      seenPrice.add(key);
    }
  });

/**
 * @returns {string[]} human-readable errors, empty when the content is valid.
 */
export function collectContentErrors(content) {
  const result = contentSchema.safeParse(content);
  if (result.success) return [];

  return result.error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join('.') : '(root)';
    return `${path}: ${issue.message}`;
  });
}
