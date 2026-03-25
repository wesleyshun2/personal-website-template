'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Post {
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    slug: string;
}

interface BlogListProps {
    posts: Post[];
    dict: any;
    locale: string;
    currentPage?: number;
    totalPages?: number;
    currentCategory?: string;
    allCategories?: string[];
    showFilters?: boolean;
    showPagination?: boolean;
    scrollTarget?: string;
}

export function BlogList({ 
    posts, 
    dict, 
    locale, 
    currentPage, 
    totalPages, 
    currentCategory,
    allCategories,
    showFilters = true,
    showPagination = true,
    scrollTarget
}: BlogListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getHref = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        if (name === 'category') {
            params.set('page', '1'); // Reset to page 1 when category changes
        }
        const qs = params.toString();
        return `${pathname}?${qs}${scrollTarget ? `#${scrollTarget}` : ''}`;
    };

    return (
        <div className="space-y-12">
            {/* Filter Buttons */}
            {showFilters && allCategories && allCategories.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={getHref('category', dict.blog.all)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${currentCategory === dict.blog.all
                                ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                            }`}
                    >
                        {dict.blog.all}
                    </Link>
                    {allCategories.map(cat => (
                        <Link
                            key={cat}
                            href={getHref('category', cat)}
                            className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${currentCategory === cat
                                    ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                    : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                                }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            )}

            {/* List */}
            {posts.length > 0 ? (
                <div className="space-y-20">
                    <div className="space-y-20">
                        {posts.map((post, index) => (
                            <article key={post.slug || index} className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                                <div className="md:col-span-5 relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 40vw"
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
                                        <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>

                                    <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-lg max-w-2xl">
                                        {post.excerpt}
                                    </p>

                                    <Link
                                        href={`/${locale}/blog/${post.slug}`}
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

                    {/* Pagination */}
                    {showPagination && currentPage && totalPages && totalPages > 1 && (
                        <div className="flex items-center justify-between pt-12 border-t border-zinc-100 dark:border-zinc-900">
                            <div className="text-sm text-zinc-500 font-light">
                                {dict.blog.page.replace('%d', currentPage.toString())} / {totalPages}
                            </div>
                            <div className="flex space-x-4">
                                {currentPage > 1 ? (
                                    <Link
                                        href={getHref('page', (currentPage - 1).toString())}
                                        className="inline-flex items-center px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {dict.blog.previous}
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center px-6 py-2 rounded-full border border-zinc-100 dark:border-zinc-900 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {dict.blog.previous}
                                    </span>
                                )}

                                {currentPage < totalPages ? (
                                    <Link
                                        href={getHref('page', (currentPage + 1).toString())}
                                        className="inline-flex items-center px-6 py-2 rounded-full border border-zinc-950 dark:border-zinc-50 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                                    >
                                        {dict.blog.next}
                                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center px-6 py-2 rounded-full border border-zinc-100 dark:border-zinc-900 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                                        {dict.blog.next}
                                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 font-light">{dict.blog.noResults}</p>
                </div>
            )}
        </div>
    );
}
