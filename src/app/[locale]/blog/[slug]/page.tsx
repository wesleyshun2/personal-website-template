import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getMarkdownContent, getAllContentSlugs } from '@/lib/mdx';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    const slugs = getAllContentSlugs(locale as Locale, 'blog');
    return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const { data: metadata, content } = getMarkdownContent(typedLocale, slug, 'blog');

    if (!content) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <article className="max-w-3xl mx-auto">
                    <header className="mb-12">
                        <Link
                            href={`/${typedLocale}/blog`}
                            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
                        >
                            <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Back to Blog
                        </Link>

                        <div className="flex items-center space-x-4 text-xs tracking-widest uppercase font-medium text-zinc-500 mb-4">
                            <span>{metadata.category}</span>
                            <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                            <span>{metadata.date}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
                            {metadata.title}
                        </h1>

                        {metadata.image && (
                            <div className="relative aspect-video overflow-hidden rounded-2xl mb-12">
                                <Image
                                    src={metadata.image}
                                    alt={metadata.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </header>

                    <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none font-light leading-relaxed">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </article>
            </div>
        </main>
    );
}
