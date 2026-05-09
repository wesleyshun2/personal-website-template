'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

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
    const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '70%']);
    // Text moves slightly upwards (minimal for smoothness)
    const textY = useTransform(scrollY, [0, 600], [0, -30]);
    // Opacity fades as user scrolls down
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    // Optional: blur the background as it fades
    const blurEffect = useTransform(scrollY, [0, 500], ['blur(0px)', 'blur(8px)']);

    return (
        <div className="relative h-[90vh] min-h-[450px] w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            {/* Background Image Layer with Parallax */}
            <motion.div
                style={{ y: backgroundY, filter: blurEffect }}
                className="absolute inset-0 z-0 h-[110%] -top-[5%]"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Hero Background"
                        fill
                        className="object-cover opacity-100 select-none pointer-events-none"
                        priority
                    />
                    {/* Gradient overlays for readability and smooth transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-zinc-50/10 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/10" />
                    <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />

                    {/* Glass Overlay integrated into background layer */}
                    <div className={`absolute inset-0 pointer-events-none ${siteConfig.hero.glassBlur} ${siteConfig.hero.glassOpacityLight} ${siteConfig.hero.glassOpacityDark}`} />
                </div>
            </motion.div>

            {/* Content Layer */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 flex flex-col items-center justify-center px-8 mt-[100px] text-center max-w-6xl mx-auto"
            >
                <h1 className="text-4xl md:text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-[1] drop-shadow-md">
                    {title}
                </h1>
                <p className="text-lg md:text-2xl text-zinc-700 dark:text-zinc-300 font-light max-w-3xl mx-auto mb-10 drop-shadow-sm">
                    {subtitle}
                </p>

                <div className="flex flex-col items-center">
                    {children}
                </div>
            </motion.div>

        </div>
    );
}
