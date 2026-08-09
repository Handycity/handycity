/// <reference types="astro/client" />

/**
 * Alpine is loaded from public/vendor as a plain script tag, so it is not part
 * of the module graph and TypeScript has no idea it exists. These declarations
 * describe just the surface the inline component scripts actually use.
 */
interface AlpineComponent {
  [key: string]: unknown;
}

interface AlpineGlobal {
  data(name: string, factory: (...args: any[]) => AlpineComponent): void;
  $data<T = Record<string, any>>(el: Element): T;
  start(): void;
}

declare global {
  interface Window {
    Alpine: AlpineGlobal;
  }
}

export {};
