'use client';

import * as React from 'react';
import Link from 'next/link';

interface ProjectSubHeaderProps {
    title: string;
    backLabel: string;
    backHref: string;
}

export function ProjectSubHeader({ title, backLabel, backHref }: ProjectSubHeaderProps) {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            className={`sticky top-16 z-40 transition-all duration-500 ease-in-out ${
                scrolled 
                    ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-0' 
                    : 'bg-transparent border-b border-transparent py-2'
            }`}
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href={backHref}
                    className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span className="hidden sm:inline">{backLabel}</span>
                    <span className="sm:hidden">Back</span>
                </Link>
                
                <div className="flex-1 px-4 truncate text-center">
                    <span 
                        className={`text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 transition-all duration-500 ${
                            scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                        }`}
                    >
                        {title}
                    </span>
                </div>

                <div className="w-24 flex justify-end">
                    {/* Placeholder for symmetry */}
                </div>
            </div>
        </div>
    );
}
