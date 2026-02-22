export const i18n = {
  defaultLocale: 'tw',
  locales: ['tw', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
