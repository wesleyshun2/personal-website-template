import { Mail } from 'lucide-react';
import { SiX, SiDiscord, SiLinkedin, SiTelegram } from 'react-icons/si';

export function SocialLinks({ className = "" }: { className?: string }) {
    const socials = [
        { name: 'X (Twitter)', icon: SiX, url: 'https://twitter.com/_' },
        { name: 'LinkedIn', icon: SiLinkedin, url: 'https://linkedin.com/' },
        { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/' },
        { name: 'Telegram', icon: SiTelegram, url: 'https://t.me/' },
        { name: 'Email', icon: Mail, url: 'mailto:hello@example.com' },
    ];

    return (
        <div className={`flex items-center gap-6 ${className}`}>
            {socials.map((s) => (
                <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-300"
                    aria-label={s.name}
                >
                    <s.icon size={20} />
                </a>
            ))}
        </div>
    );
}
