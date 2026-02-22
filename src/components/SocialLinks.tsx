import { Github, Twitter, Linkedin, Mail, MessagesSquare, Send } from 'lucide-react';

export function SocialLinks() {
    const socials = [
        { name: 'X (Twitter)', icon: Twitter, url: 'https://twitter.com/_' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/' },
        { name: 'Discord', icon: MessagesSquare, url: 'https://discord.com/' },
        { name: 'Telegram', icon: Send, url: 'https://t.me/' },
        { name: 'Email', icon: Mail, url: 'mailto:hello@example.com' },
    ];

    return (
        <div className="flex items-center gap-6 mt-8">
            {socials.map((s) => (
                <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-300"
                    aria-label={s.name}
                >
                    <s.icon size={22} strokeWidth={1.5} />
                </a>
            ))}
        </div>
    );
}
