import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getMarkdownContent, getAllContentSlugs } from '@/lib/mdx';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    const slugs = getAllContentSlugs(locale as Locale, 'portfolio');
    return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const { data: metadata, content } = getMarkdownContent(typedLocale, slug, 'portfolio');

    if (!content) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-16">
                        <Link
                            href={`/${typedLocale}/portfolio`}
                            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
                        >
                            <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Back to Portfolio
                        </Link>

                        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
                            {metadata.title}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-12">
                            {metadata.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {metadata.image && (
                            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-16 shadow-2xl shadow-black/5">
                                <Image
                                    src={metadata.image}
                                    alt={metadata.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-8">
                            <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none font-light leading-relaxed">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <div className="sticky top-32 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-lg font-medium mb-4">Project Info</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm mb-6 leading-relaxed">
                                    {metadata.description}
                                </p>
                                <button className="w-full py-3 px-6 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
                                    View Live Project
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
