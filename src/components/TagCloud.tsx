'use client';

import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import Link from 'next/link';

interface TagCloudProps {
    allTags: string[];
    activeTags: string[];
    getHref: (tag: string | 'clear') => string;
    dict: {
        more: string;
        collapse: string;
        clear: string;
    };
    onClear?: () => void;
}

export function TagCloud({
    allTags,
    activeTags,
    getHref,
    dict,
    onClear
}: TagCloudProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [visibleCount, setVisibleCount] = useState(allTags.length);
    const [shouldPin, setShouldPin] = useState(false);
    const [pinnedTags, setPinnedTags] = useState<string[]>([]);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);

    // Smart sorting logic
    const isPinningActive = !isExpanded && shouldPin && activeTags.length > 0;
    
    const displayTags = useMemo(() => {
        if (isPinningActive && pinnedTags.length > 0) {
            return [...pinnedTags, ...allTags.filter(t => !pinnedTags.includes(t))];
        }
        return allTags;
    }, [isPinningActive, allTags, pinnedTags]);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            if (measureRef.current) {
                const container = measureRef.current;
                const children = Array.from(container.children) as HTMLElement[];
                
                const maxH = 88; // Height for ~2 rows
                let firstOverflowIndex = -1;
                
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const rect = child.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const relativeBottom = rect.bottom - containerRect.top;
                    
                    if (relativeBottom > maxH) {
                        firstOverflowIndex = i;
                        break;
                    }
                }

                if (firstOverflowIndex !== -1) {
                    setHasOverflow(true);
                    // Offset by 2 if "Clear" is present, 1 otherwise (for "More" button)
                    const offset = activeTags.length > 0 ? 2 : 1;
                    setVisibleCount(Math.max(0, firstOverflowIndex - offset));
                } else {
                    setHasOverflow(false);
                    setVisibleCount(allTags.length);
                }
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [displayTags, activeTags, isExpanded]);

    return (
        <div className="relative">
            {/* Visual Container */}
            <div 
                ref={containerRef}
                className="flex flex-wrap gap-3 transition-all duration-500 ease-in-out"
            >
                {displayTags.map((tag, index) => {
                    const isVisible = isExpanded || index < visibleCount;
                    if (!isVisible) return null;

                    return (
                        <Link
                            key={tag}
                            href={getHref(tag)}
                            className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border shrink-0 ${activeTags.includes(tag)
                                ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                                : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                                }`}
                        >
                            {tag}
                        </Link>
                    );
                })}
                
                {/* Integrated "More" Tag */}
                {hasOverflow && (
                    <button
                        onClick={() => {
                            if (isExpanded) {
                                setShouldPin(true);
                                setPinnedTags(activeTags);
                            }
                            setIsExpanded(!isExpanded);
                        }}
                        className="px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50 shrink-0"
                    >
                        {isExpanded ? `- ${dict.collapse}` : `+ ${dict.more}`}
                    </button>
                )}

                {/* Clear Selection */}
                {activeTags.length > 0 && (
                    <Link
                        href={getHref('clear')}
                        onClick={() => {
                            setShouldPin(false);
                            setPinnedTags([]);
                            if (onClear) onClear();
                        }}
                        className="px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 shrink-0 flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {dict.clear}
                    </Link>
                )}
            </div>

            {/* Hidden Measuring Container */}
            <div 
                ref={measureRef}
                className="flex flex-wrap gap-3 absolute top-0 left-0 invisible pointer-events-none -z-10 w-full"
                aria-hidden="true"
            >
                <div className="px-4 py-2 border">+ MORE</div>
                {activeTags.length > 0 && (
                    <div className="px-4 py-2 border">CLEAR</div>
                )}
                {displayTags.map(tag => (
                    <div key={tag} className="px-4 py-2 border">{tag}</div>
                ))}
            </div>
        </div>
    );
}
