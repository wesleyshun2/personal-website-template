'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Languages, Home, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        // Close menu when route changes
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleLang = () => {
        if (!pathname) return '/';
        const currentPath = pathname.replace(`/${lang}`, '');
        const newLang = lang === 'tw' ? 'en' : 'tw';
        return `/${newLang}${currentPath}`;
    };

    const navLinks = [
        { href: `/${lang}`, label: dict.navigation.blog },
        { href: `/${lang}/resume`, label: dict.navigation.resume },
        { href: `/${lang}/portfolio`, label: dict.navigation.portfolio },
    ];

    return (
        <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 print:hidden">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
                {/* Mobile Menu Button - Left */}
                <div className="md:hidden flex-1 flex">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 -ml-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <div className="space-y-1.5 w-5">
                            <span className="block h-0.5 w-full bg-current rounded-full" />
                            <span className="block h-0.5 w-full bg-current rounded-full" />
                            <span className="block h-0.5 w-full bg-current rounded-full" />
                        </div>}
                    </button>
                </div>

                {/* Left placeholder to balance centering (Desktop) */}
                <div className="hidden md:block flex-1" />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 flex-initial">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right icons container */}
                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
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

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-4 shadow-lg absolute w-full">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className="block px-4 py-3 text-base font-medium rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
