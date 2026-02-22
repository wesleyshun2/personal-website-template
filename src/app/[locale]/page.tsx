import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { HeroParallax } from '@/components/HeroParallax';
import { SocialLinks } from '@/components/SocialLinks';
import { getMarkdownContent } from '@/lib/mdx';
import ReactMarkdown from 'react-markdown';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  // Fetch About markdown content
  const { content } = getMarkdownContent(typedLocale, 'about');

  return (
    <main className="min-h-screen">
      <HeroParallax title={dict.home.title} subtitle={dict.home.subtitle}>
        <SocialLinks className="mt-8" />
      </HeroParallax>

      <section id="about" className="container mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">{dict.navigation.about}</h2>
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            <ReactMarkdown>{content || ''}</ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  );
}
