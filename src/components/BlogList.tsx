'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { TagCloud } from './TagCloud';

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
    activeCategories?: string[];
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
    activeCategories = [],
    allCategories = [],
    showFilters = true,
    showPagination = true,
    scrollTarget
}: BlogListProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getHref = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (name === 'category') {
            params.set('page', '1'); // Reset to page 1 when category changes
            
            if (value === 'clear') {
                params.delete('category');
            } else {
                // Toggle logic: Multi-select
                let newCats = [...activeCategories];
                if (newCats.includes(value)) {
                    newCats = newCats.filter(c => c !== value);
                } else {
                    newCats.push(value);
                }
                
                if (newCats.length === 0) {
                    params.delete('category');
                } else {
                    params.set('category', newCats.join(','));
                }
            }
        } else {
            params.set(name, value);
        }
        
        const qs = params.toString();
        return `${pathname}?${qs}${scrollTarget ? `#${scrollTarget}` : ''}`;
    };

    return (
        <div className="space-y-8">
            {/* Filter Buttons */}
            {showFilters && allCategories.length > 0 && (
                <TagCloud
                    allTags={allCategories}
                    activeTags={activeCategories}
                    getHref={(val) => getHref('category', val)}
                    dict={{
                        more: dict.portfolio?.more || "More", // Fallback if dict structure differs
                        collapse: dict.portfolio?.collapse || "Collapse",
                        clear: dict.portfolio?.clearFilters || "Clear"
                    }}
                />
            )}

            {/* List */}
            {posts.length > 0 ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4">
                        {posts.map((post, index) => (
                            <Link
                                key={post.slug || index}
                                href={`/${locale}/blog/${post.slug}?page=${currentPage}&category=${activeCategories.join(',')}`}
                                className="group flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 
                                border border-zinc-100 dark:border-zinc-900 rounded-[1rem] 
                                overflow-hidden transition-colors duration-500 hover:bg-zinc-100 
                                dark:hover:bg-zinc-900"
                            >
                                <div className="p-1 flex flex-col md:flex-row gap-4 h-full">
                                    <div className="relative aspect-video w-full md:w-72 shrink-0 rounded-lg overflow-hidden 
                                    bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 300px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-102"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 h-full pt-2 pb-2 px-3 md:px-0">
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light mb-1">
                                            {post.date}
                                        </p>
                                        <h3 className="text-xl font-normal tracking-tight group-hover:text-zinc-600 
                                        dark:group-hover:text-zinc-200 transition-colors mb-1">
                                            {post.title}
                                        </h3>
                                        <p className="text-zinc-800 dark:text-zinc-200 font-light text-m line-clamp-2 
                                        mb-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center justify-start">
                                            <span className="text-sm uppercase tracking-widest font-medium text-zinc-500">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {showPagination && currentPage && totalPages && totalPages > 1 && (
                        <div className="flex justify-center pt-2 border-t border-zinc-100 dark:border-zinc-900">
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                {currentPage > 1 ? (
                                    <Link
                                        href={getHref('page', (currentPage - 1).toString())}
                                        className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors group"
                                        aria-label={dict.blog?.previous || "Previous"}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </span>
                                )}

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-2">
                                    {((): (number | string)[] => {
                                        if (totalPages <= 7) {
                                            return Array.from({ length: totalPages }, (_, i) => i + 1);
                                        }

                                        const pages: (number | string)[] = [];
                                        const leftLimit = 2;
                                        const rightLimit = totalPages - 1;

                                        pages.push(1);

                                        if (currentPage > 3) {
                                            pages.push('...');
                                        }

                                        const start = Math.max(leftLimit, currentPage - 1);
                                        const end = Math.min(rightLimit, currentPage + 1);

                                        for (let i = start; i <= end; i++) {
                                            pages.push(i);
                                        }

                                        if (currentPage < totalPages - 2) {
                                            pages.push('...');
                                        }

                                        pages.push(totalPages);
                                        return pages;
                                    })().map((pageNum, idx) => {
                                        if (pageNum === '...') {
                                            return (
                                                <span
                                                    key={`ellipsis-${idx}`}
                                                    className="w-10 h-10 inline-flex items-center justify-center text-zinc-400"
                                                >
                                                    &hellip;
                                                </span>
                                            );
                                        }

                                        const isCurrent = pageNum === currentPage;
                                        return (
                                            <Link
                                                key={pageNum}
                                                href={getHref('page', pageNum.toString())}
                                                className={`w-10 h-10 inline-flex items-center justify-center rounded-full text-sm font-medium transition-all border ${isCurrent
                                                    ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                                    : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                                                    }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                {currentPage < totalPages ? (
                                    <Link
                                        href={getHref('page', (currentPage + 1).toString())}
                                        className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors group"
                                        aria-label={dict.blog?.next || "Next"}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-zinc-100 dark:border-zinc-900 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
