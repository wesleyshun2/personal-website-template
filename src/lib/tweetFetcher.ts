
export interface SourceData {
  type: 'data' | 'embed';
  data?: {
    url: string;
    title: string;
    description: string;
    image: string;
    hostname: string;
  };
  embedUrl?: string;
}

export async function fetchExternalSourceData(sourceUrl: string): Promise<SourceData | null> {
  if (!sourceUrl) return null;
  // User requested to always use embedded views as fallback
  return { type: 'embed', embedUrl: sourceUrl };
}
