'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Languages, Home } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type Locale } from '@/i18n-config';

export function Navbar({
    dict,
    lang,
}: {
    dict: any;
    lang: Locale;
}) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleLang = () => {
        if (!pathname) return '/';
        const currentPath = pathname.replace(`/${lang}`, '');
        const newLang = lang === 'tw' ? 'en' : 'tw';
        return `/${newLang}${currentPath}`;
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 print:hidden">
            <div className="container mx-auto px-6 h-16 flex items-center">
                {/* Left placeholder to balance centering */}
                <div className="flex-1" />

                <nav className="hidden md:flex items-center gap-8 flex-initial">
                    <Link href={`/${lang}`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.blog}
                    </Link>
                    <Link href={`/${lang}/resume`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.resume}
                    </Link>
                    <Link href={`/${lang}/portfolio`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.portfolio}
                    </Link>
                </nav>

                {/* Right icons container */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    <Link
                        href={`/${lang}`}
                        className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        aria-label="Go to home"
                    >
                        <Home size={18} />
                    </Link>
                    <Link
                        href={toggleLang()}
                        className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        aria-label="Toggle language"
                    >
                        <Languages size={18} />
                    </Link>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        aria-label="Toggle theme"
                    >
                        {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
