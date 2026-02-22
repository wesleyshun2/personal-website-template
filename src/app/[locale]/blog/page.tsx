import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const posts = [
        {
            title: 'The Future of Minimalist Web Design',
            excerpt: 'Exploring how simplicity and empty space can create more impactful digital experiences.',
            date: '2024-03-20',
            category: 'Design',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
        },
        {
            title: 'Optimizing Next.js for Performance',
            excerpt: 'Lighthouse scores matter. Here is how we achieved a perfect 100/100/100/100.',
            date: '2024-03-15',
            category: 'Development',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        },
        {
            title: 'Building a Brand as a Developer',
            excerpt: 'Why your personal identity is as important as your technical skills in the modern market.',
            date: '2024-03-10',
            category: 'Career',
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
        },
    ];

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <header className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                        {dict.blog.title}
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                        {dict.blog.subtitle}
                    </p>
                </header>

                <div className="space-y-20">
                    {posts.map((post, index) => (
                        <article
                            key={index}
                            className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                        >
                            <div className="md:col-span-5 relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="md:col-span-7 flex flex-col space-y-4">
                                <div className="flex items-center space-x-4 text-xs tracking-widest uppercase font-medium text-zinc-500">
                                    <span>{post.category}</span>
                                    <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                                    <span>{post.date}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-light tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                    <Link href="#">{post.title}</Link>
                                </h2>

                                <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg max-w-2xl">
                                    {post.excerpt}
                                </p>

                                <Link
                                    href="#"
                                    className="inline-flex items-center text-sm font-medium pt-2 group/link"
                                >
                                    <span className="border-b border-zinc-900 dark:border-zinc-50 pb-0.5">
                                        {dict.blog.readMore}
                                    </span>
                                    <svg
                                        className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
