'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroParallax({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background with parallax effect */}
            <motion.div
                style={{ y: y1, opacity }}
                className="absolute inset-0 z-0 flex flex-col items-center justify-center p-8 text-center"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 max-w-5xl">
                    {title}
                </h1>
                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light max-w-2xl">
                    {subtitle}
                </p>

                {children}
            </motion.div>

            {/* Scroll indicator overlay at the bottom */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs uppercase tracking-widest text-zinc-400">Scroll</span>
                <div className="w-[1px] h-8 bg-zinc-400" />
            </div>
        </div>
    );
}
