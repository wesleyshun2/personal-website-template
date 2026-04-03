'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

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
    
    // Parallax values
    // Background moves slower than the scroll (creates depth)
    const backgroundY = useTransform(scrollY, [0, 800], ['0%', '30%']);
    // Text moves slightly upwards or at a different rate
    const textY = useTransform(scrollY, [0, 500], [0, -40]);
    // Opacity fades as user scrolls down
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    // Optional: blur the background as it fades
    const blur = useTransform(scrollY, [0, 500], ['blur(0px)', 'blur(8px)']);

    return (
        <div className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            {/* Background Image Layer with Parallax */}
            <motion.div
                style={{ y: backgroundY, filter: blur }}
                className="absolute inset-0 z-0 h-[120%] -top-[10%]"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Hero Background"
                        fill
                        className="object-cover opacity-70 dark:opacity-40 select-none pointer-events-none"
                        priority
                    />
                    {/* Gradient overlays for readability and smooth transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-zinc-50/30 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/30" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />
                </div>
            </motion.div>

            {/* Content Layer */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-6xl mx-auto"
            >
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 mb-8 leading-[1.1] drop-shadow-sm">
                    {title}
                </h1>
                <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-300 font-light max-w-2xl mx-auto drop-shadow-sm">
                    {subtitle}
                </p>

                {children}
            </motion.div>

        </div>
    );
}
