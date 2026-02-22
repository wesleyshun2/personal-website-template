import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const projects = [
        {
            title: 'E-commerce Platform',
            description: 'A premium shopping experience for luxury goods.',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            tags: ['Next.js', 'Tailwind', 'Stripe'],
        },
        {
            title: 'Fitness Tracker App',
            description: 'Modern mobile app interface with glassmorphism.',
            image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800',
            tags: ['React Native', 'Framer Motion'],
        },
        {
            title: 'Architecture Portfolio',
            description: 'Minimalist website for an award-winning firm.',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
            tags: ['TypeScript', 'Three.js'],
        },
        {
            title: 'Digital Agency Site',
            description: 'Dynamic and interactive showcase of creative work.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            tags: ['Webflow', 'GSAP'],
        },
    ];

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <header className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                        {dict.portfolio.title}
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                        {dict.portfolio.subtitle}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col space-y-4"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-2xl font-light tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm line-clamp-2">
                                    {project.description}
                                </p>
                                <Link
                                    href="#"
                                    className="inline-flex items-center text-sm font-medium mt-2 group/link"
                                >
                                    <span className="border-b border-zinc-900 dark:border-zinc-50 pb-0.5">
                                        {dict.portfolio.viewProject}
                                    </span>
                                    <svg
                                        className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
