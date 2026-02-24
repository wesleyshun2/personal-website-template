'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Project {
    title: string;
    description: string;
    image: string;
    tags: string[];
    slug: string;
}

interface PortfolioListProps {
    projects: Project[];
    dict: any;
    locale: string;
}

export function PortfolioList({ projects, dict, locale }: PortfolioListProps) {
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));
    const [activeTag, setActiveTag] = useState(dict.portfolio.all);

    const filteredProjects = activeTag === dict.portfolio.all
        ? projects
        : projects.filter(p => p.tags.includes(activeTag));

    return (
        <div className="space-y-12">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setActiveTag(dict.portfolio.all)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${activeTag === dict.portfolio.all
                            ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                        }`}
                >
                    {dict.portfolio.all}
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${activeTag === tag
                                ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {filteredProjects.map((project, index) => (
                        <div key={project.slug || index} className="group relative flex flex-col space-y-4">
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {project.tags.map((tag: string) => (
                                        <span key={tag} className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-2xl font-light tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm line-clamp-2">
                                    {project.description}
                                </p>
                                <Link
                                    href={`/${locale}/portfolio/${project.slug}`}
                                    className="inline-flex items-center text-sm font-medium mt-2 group/link"
                                >
                                    <span className="border-b border-zinc-900 dark:border-zinc-50 pb-0.5">
                                        {dict.portfolio.viewProject}
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
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 font-light">{dict.portfolio.noResults}</p>
                </div>
            )}
        </div>
    );
}
