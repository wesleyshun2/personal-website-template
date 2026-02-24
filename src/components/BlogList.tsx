'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
}

export function BlogList({ posts, dict, locale }: BlogListProps) {
    const allCategories = Array.from(new Set(posts.map(p => p.category)));
    const [activeCategory, setActiveCategory] = useState(dict.blog.all);

    const filteredPosts = activeCategory === dict.blog.all
        ? posts
        : posts.filter(p => p.category === activeCategory);

    return (
        <div className="space-y-12">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setActiveCategory(dict.blog.all)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${activeCategory === dict.blog.all
                            ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                        }`}
                >
                    {dict.blog.all}
                </button>
                {allCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${activeCategory === cat
                                ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            {filteredPosts.length > 0 ? (
                <div className="space-y-20">
                    {filteredPosts.map((post, index) => (
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
            ) : (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 font-light">{dict.blog.noResults}</p>
                </div>
            )}
        </div>
    );
}
