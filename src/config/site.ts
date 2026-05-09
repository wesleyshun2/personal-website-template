export const siteConfig = {
  hero: {
    // 依據您的手動調整：3px 模糊
    glassBlur: 'backdrop-blur-[3px]',
    // 依據您的手動調整：60% 白色
    glassOpacityLight: 'bg-white/60',
    // 依據您的手動調整：40% 黑色
    glassOpacityDark: 'dark:bg-black/40',
  },
  musings: {
    sources: {
      tw: 'https://bsky.app/',
      en: 'https://bsky.app/',
    }
  }
};

export type SiteConfig = typeof siteConfig;
