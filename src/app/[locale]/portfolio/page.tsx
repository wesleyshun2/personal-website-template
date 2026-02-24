import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { PortfolioList } from '@/components/PortfolioList';

export default async function PortfolioPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const projectsData = getAllContentWithMetadata(typedLocale, 'portfolio');

    const projects = projectsData.map(project => ({
        title: project.metadata.title || 'Untitled',
        description: project.metadata.description || '',
        image: project.metadata.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        tags: project.metadata.tags || [],
        slug: project.slug,
    }));

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

                <PortfolioList projects={projects} dict={dict} locale={typedLocale} />
            </div>
        </main>
    );
}



