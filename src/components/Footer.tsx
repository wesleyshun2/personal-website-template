import Link from 'next/link';
import { SocialLinks } from './SocialLinks';

export function Footer({ dict }: { dict: any; lang: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md mt-20 print:hidden">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center gap-8">
                {/* Social Section */}
                <div className="flex flex-col items-center gap-4">
                    <SocialLinks />
                </div>

                {/* Copyright Section */}
                <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        © {currentYear} MySite. {dict.footer.rights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
