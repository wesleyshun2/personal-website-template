import { Mail } from 'lucide-react';
import { SiBluesky, SiX, SiDiscord, SiLinkedin, SiTelegram } from 'react-icons/si';

export function SocialLinks({ className = "" }: { className?: string }) {
    const socials = [
        { name: 'LinkedIn', icon: SiLinkedin, url: 'https://linkedin.com/' },
        { name: 'Bluesky', icon: SiBluesky, url: 'https://bsky.app/profile/coddybarks.bsky.social' },
        { name: 'X', icon: SiX, url: 'https://x.com/' },
        { name: 'Telegram', icon: SiTelegram, url: 'https://t.me/' },
        { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/' },
        { name: 'Email', icon: Mail, url: 'mailto:hello@example.com' },
    ];

    return (
        <div className={`flex items-center gap-8 ${className}`}>
            {socials.map((s) => (
                <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-all duration-300 transform hover:scale-110"
                    aria-label={s.name}
                >
                    <s.icon size={22} />
                </a>
            ))}
        </div>
    );
}
