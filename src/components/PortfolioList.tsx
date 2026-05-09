'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { TagCloud } from './TagCloud';

interface Project {
    title: string;
    description: string;
    image: string;
    tags: string[];
    slug: string;
    date?: string;
}

interface PortfolioListProps {
    projects: Project[];
    dict: any;
    locale: string;
    currentPage: number;
    totalPages: number;
    activeTag: string;
    activeTags: string[];
    allTags: string[];
}

export function PortfolioList({
    projects,
    dict,
    locale,
    currentPage,
    totalPages,
    activeTag,
    activeTags,
    allTags
}: PortfolioListProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getHref = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (name === 'tag') {
            params.set('page', '1'); // Reset to page 1 when tag changes
            
            if (value === 'clear') {
                params.delete('tag');
            } else {
                // Toggle logic: Multi-select (OR)
                let newTags = [...activeTags];
                if (newTags.includes(value)) {
                    newTags = newTags.filter(t => t !== value);
                } else {
                    newTags.push(value);
                }
                
                if (newTags.length === 0) {
                    params.delete('tag');
                } else {
                    params.set('tag', newTags.join(','));
                }
            }
        } else {
            params.set(name, value);
        }
        
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="space-y-8">
            {/* Filter Buttons */}
            <TagCloud
                allTags={allTags}
                activeTags={activeTags}
                getHref={(val) => getHref('tag', val)}
                dict={{
                    more: dict.portfolio.more,
                    collapse: dict.portfolio.collapse,
                    clear: dict.portfolio.clearFilters || "Clear"
                }}
            />

            {/* Grid */}
            {projects.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                        {projects.map((project, index) => (
                            <Link
                                key={project.slug || index}
                                href={`/${locale}/portfolio/${project.slug}?page=${currentPage}&tag=${activeTag}`}
                                className="group flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 
                                border border-zinc-100 dark:border-zinc-900 rounded-[1rem] 
                                overflow-hidden transition-colors duration-500 hover:bg-zinc-100 
                                dark:hover:bg-zinc-900"
                            >
                                <div className="p-4 flex flex-col h-full">
                                    <div className="relative aspect-video w-full mb-2 rounded-lg overflow-hidden 
                                    bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-102"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-xl font-semibold tracking-tight group-hover:text-zinc-600 
                                        dark:group-hover:text-zinc-200 transition-colors mb-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-zinc-800 dark:text-zinc-200 font-light text-m line-clamp-2 
                                        mb-1">
                                            {project.description}
                                        </p>
                                        {project.date && (
                                            <p className="mt-auto text-zinc-800 dark:text-zinc-200 text-sm font-light">
                                                {project.date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center pt-4 border-t border-zinc-100 dark:border-zinc-900">
                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                {currentPage > 1 ? (
                                    <Link
                                        href={getHref('page', (currentPage - 1).toString())}
                                        className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-colors group"
                                        aria-label={dict.portfolio.previous}
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
                                        aria-label={dict.portfolio.next}
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
                    <p className="text-zinc-500 font-light">{dict.portfolio.noResults}</p>
                </div>
            )}
        </div>
    );
}
