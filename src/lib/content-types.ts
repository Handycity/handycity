import type { z } from 'zod';
import { contentSchema } from './content-schema.mjs';

/**
 * The shape of the content store, derived from the runtime schema rather than
 * hand-written alongside it — so the types and the validation cannot disagree.
 */
export type Content = z.infer<typeof contentSchema>;

export type Site = Content['site'];
export type Company = Content['company'];
export type Hours = Content['hours'];
export type HoursEntry = Hours[number];
export type Hero = Content['hero'];
export type TrustBar = Content['trustBar'];
export type Services = Content['services'];
export type Trust = Content['trust'];
export type Process = Content['process'];
export type LocationContent = Content['location'];
export type Contact = Content['contact'];
export type Reviews = Content['reviews'];
export type Calculator = Content['calculator'];
export type PriceEntry = Calculator['prices'][number];
export type GeraeteRetterPraemie = Content['geraeteRetterPraemie'];
export type Willhaben = Content['willhaben'];
export type Faq = Content['faq'];
