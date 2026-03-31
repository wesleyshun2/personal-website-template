'use client';

import Image from 'next/image';
import { Youtube, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import type { SourceData } from '@/lib/tweetFetcher';

interface LinkPreview {
    url: string;
    title: string;
    description: string;
    image: string;
}

interface MicroPost {
    id: string;
    content: string;
    date: string;
    youtube?: string;
    image?: string;
    linkPreview?: LinkPreview;
}

interface MicroBlogProps {
    posts: MicroPost[];
    title: string;
    sourceUrl?: string; // Optional external source URL
    externalSourceData?: SourceData | null;
}

export function MicroBlog({ posts, title, sourceUrl, externalSourceData }: MicroBlogProps) {
    const [visibleCount, setVisibleCount] = useState(5);
    const containerRef = useRef<HTMLDivElement>(null);
    const initialCount = 5;
    const loadStep = 3;
    const threshold = 15;

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        // If we're within 50px of the bottom
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            // Check if we should load more
            if (visibleCount < posts.length) {
                // If sourceUrl exists, don't load past threshold
                if (sourceUrl && visibleCount >= threshold) {
                    return;
                }
                setVisibleCount(prev => Math.min(prev + loadStep, posts.length));
            }
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const { scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight <= clientHeight && visibleCount < posts.length) {
            if (sourceUrl && visibleCount >= threshold) {
                return;
            }
            setVisibleCount(prev => Math.min(prev + loadStep, posts.length));
        }
    }, [visibleCount, posts.length, sourceUrl, threshold]);

    // Load Twitter widget if we have to render a twitter embed
    useEffect(() => {
        if (externalSourceData?.type === 'embed' && (externalSourceData.embedUrl?.includes('twitter.com') || externalSourceData.embedUrl?.includes('x.com'))) {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            document.body.appendChild(script);
        }
    }, [externalSourceData]);

    const visiblePosts = posts.slice(0, visibleCount);
    const showSourceLink = sourceUrl && (visibleCount >= threshold || visibleCount >= posts.length);
    const hasMore = visibleCount < posts.length && (!sourceUrl || visibleCount < threshold);

    return (
        <aside className="h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-8 shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </div>
                <h3 className="text-xl font-light tracking-tight">{title}</h3>
            </div>

            <div className="relative flex-1 min-h-0">
                <div 
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="space-y-6 absolute inset-0 overflow-y-auto pr-2 custom-scrollbar scroll-smooth pb-12"
                >
                    {/* Render External Source Header */}
                    {externalSourceData?.type === 'data' && externalSourceData.data && (
                        <a
                            href={externalSourceData.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all mb-6 group"
                        >
                            {externalSourceData.data.image && (
                                <div className="relative aspect-[2.5/1] w-full bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800">
                                    <Image
                                        src={externalSourceData.data.image}
                                        alt={externalSourceData.data.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center space-x-1 text-xs text-zinc-400 mb-2 uppercase tracking-widest font-medium">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{externalSourceData.data.hostname}</span>
                                </div>
                                <h4 className="text-base font-medium mb-1 line-clamp-1">{externalSourceData.data.title}</h4>
                                <p className="text-xs text-zinc-500 line-clamp-2 font-light">{externalSourceData.data.description}</p>
                            </div>
                        </a>
                    )}

                    {externalSourceData?.type === 'embed' && externalSourceData.embedUrl?.includes('twitter.com') && (
                        <div className="mb-6 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                            <a
                                className="twitter-timeline"
                                data-theme="dark"
                                data-chrome="noheader nofooter noborders transparent"
                                data-tweet-limit="3"
                                href={externalSourceData.embedUrl}
                            >
                                Tweets by External Source
                            </a>
                        </div>
                    )}
                    {externalSourceData?.type === 'embed' && externalSourceData.embedUrl?.includes('x.com') && (
                        <div className="mb-6 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                            <a
                                className="twitter-timeline"
                                data-theme="dark"
                                data-chrome="noheader nofooter noborders transparent"
                                data-tweet-limit="3"
                                href={externalSourceData.embedUrl.replace('x.com', 'twitter.com')}
                            >
                                Tweets by External Source
                            </a>
                        </div>
                    )}
                    
                    {externalSourceData?.type === 'embed' && !externalSourceData.embedUrl?.includes('twitter.com') && !externalSourceData.embedUrl?.includes('x.com') && (
                        <a
                            href={externalSourceData.embedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 mb-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
                        >
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">View Reference Link</span>
                            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors" />
                        </a>
                    )}

                    <AnimatePresence initial={false}>
                        {visiblePosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
                            >
                                <div className="flex items-center space-x-2 mb-3 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    <span>{post.date}</span>
                                </div>

                                <p className="text-zinc-700 dark:text-zinc-300 font-light leading-relaxed mb-4 text-sm whitespace-pre-wrap">
                                    {post.content}
                                </p>

                                {/* Image Attachment */}
                                {post.image && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={post.image}
                                            alt="Attachment"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}

                                {/* YouTube Embed */}
                                {post.youtube && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${getYoutubeId(post.youtube)}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0"
                                        ></iframe>
                                    </div>
                                )}

                                {/* Link Preview */}
                                {post.linkPreview && (
                                    <a
                                        href={post.linkPreview.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div className="relative aspect-[2/1]">
                                            <Image
                                                src={post.linkPreview.image}
                                                alt={post.linkPreview.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center space-x-1 text-xs text-zinc-400 mb-1">
                                                <ExternalLink className="w-3 h-3" />
                                                <span className="truncate">{new URL(post.linkPreview.url).hostname}</span>
                                            </div>
                                            <h4 className="text-sm font-medium mb-1 line-clamp-1">{post.linkPreview.title}</h4>
                                            <p className="text-xs text-zinc-500 line-clamp-2 font-light">{post.linkPreview.description}</p>
                                        </div>
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {showSourceLink && (
                        <div className="pt-4 pb-8">
                            <a 
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50 transition-all text-sm font-medium group"
                            >
                                <span>View all on source</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Bottom Fade Gradient */}
                {hasMore && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none z-10" />
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1aa;
                }
            `}</style>
        </aside>
    );
}
