'use client';

import { useState } from 'react';

interface FilterableContentProps {
    items: any[];
    renderItem: (item: any) => React.ReactNode;
    tags: string[];
    allLabel: string;
    gridClassName?: string;
    emptyLabel?: string;
}

export function FilterableContent({
    items,
    renderItem,
    tags,
    allLabel,
    gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-12",
    emptyLabel = "No items found."
}: FilterableContentProps) {
    const [activeTag, setActiveTag] = useState(allLabel);

    const filteredItems = activeTag === allLabel
        ? items
        : items.filter(item => {
            // Handle both blog (category) and portfolio (tags array)
            if (Array.isArray(item.tags)) {
                return item.tags.includes(activeTag);
            }
            return item.category === activeTag;
        });

    return (
        <div className="space-y-12">
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setActiveTag(allLabel)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-full border ${activeTag === allLabel
                            ? "bg-zinc-950 text-zinc-50 border-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
                            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-950 dark:hover:border-zinc-50"
                        }`}
                >
                    {allLabel}
                </button>
                {tags.map(tag => (
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

            {filteredItems.length > 0 ? (
                <div className={gridClassName}>
                    {filteredItems.map((item, index) => (
                        <div key={item.slug || index}>
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 font-light">{emptyLabel}</p>
                </div>
            )}
        </div>
    );
}
