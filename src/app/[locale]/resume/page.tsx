import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getMarkdownContent } from '@/lib/mdx';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/PrintButton';
import { Mail, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);
    return {
        title: `${dict.navigation.resume} | MySite`,
    };
}

export default async function ResumePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    // Read markdown file from the root 'content/:locale/' dir instead of a category
    // Wait, by default our getMarkdownContent expects category. Let's look at getMarkdownContent:
    // export function getMarkdownContent(locale: Locale, slug: string, category: string = '')
    // So if category is '', it looks in 'content/:locale/slug.md'
    const { data: metadata, content } = getMarkdownContent(typedLocale, 'resume');

    if (!content) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24 print:pt-12 print:pb-0 print:bg-white print:text-black">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Print button container - Hidden when printing */}
                <div className="flex justify-end mb-8 print:hidden">
                    <PrintButton label={dict.resume.print} />
                </div>

                <article className="bg-white dark:bg-zinc-900/50 rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800 print:border-none print:shadow-none print:bg-white print:p-0">

                    {/* Header: Name, Title, Contact */}
                    <header className="border-b border-zinc-200 dark:border-zinc-800 print:border-zinc-300 pb-8 mb-8">
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 print:text-5xl print:text-black">
                            {metadata.name}
                        </h1>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 print:text-zinc-600 mb-6">
                            {metadata.title}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-zinc-600 dark:text-zinc-300 print:text-black">
                            {metadata.email && (
                                <a href={`mailto:${metadata.email}`} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white print:no-underline">
                                    <Mail size={16} />
                                    <span>{metadata.email}</span>
                                </a>
                            )}
                            {metadata.github && (
                                <a href={`https://${metadata.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white print:no-underline">
                                    <Github size={16} />
                                    <span>{metadata.github}</span>
                                </a>
                            )}
                            {metadata.linkedin && (
                                <a href={`https://${metadata.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white print:no-underline">
                                    <Linkedin size={16} />
                                    <span>{metadata.linkedin}</span>
                                </a>
                            )}
                        </div>
                    </header>

                    {/* Markdown Body */}
                    <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none font-light leading-relaxed print:prose-p:text-black print:prose-h2:text-black print:prose-h3:text-black print:prose-strong:text-black print:prose-li:text-black print:prose-a:text-black print:max-w-full">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>

                </article>
            </div>
        </main>
    );
}
