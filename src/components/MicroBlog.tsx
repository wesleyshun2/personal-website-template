'use client';

import Image from 'next/image';
import { Youtube, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

export function MicroBlog({ posts, title }: MicroBlogProps) {
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <aside className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </div>
                <h3 className="text-xl font-light tracking-tight">{title}</h3>
            </div>

            <div className="space-y-6">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
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
            </div>
        </aside>
    );
}
