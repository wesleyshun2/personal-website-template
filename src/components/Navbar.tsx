'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Languages } from 'lucide-react';
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
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href={`/${lang}`} className="text-xl font-medium tracking-wide">
                    MySite
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href={`/${lang}#about`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.about}
                    </Link>
                    <Link href={`/${lang}/portfolio`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.portfolio}
                    </Link>
                    <Link href={`/${lang}/blog`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.blog}
                    </Link>
                    <Link href={`/${lang}/resume`} className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {dict.navigation.resume}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
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
