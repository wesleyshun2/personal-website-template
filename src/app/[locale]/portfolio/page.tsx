import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { PortfolioList } from '@/components/PortfolioList';

export default async function PortfolioPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; tag?: string }>;
}) {
    const { locale } = await params;
    const { page, tag } = await searchParams;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const activeTags = tag ? tag.split(',') : [];
    const projectsPerPage = 6;

    const projectsData = getAllContentWithMetadata(typedLocale, 'portfolio');

    const allProjects = projectsData.map(project => ({
        title: project.metadata.title || 'Untitled',
        description: project.metadata.description || '',
        image: project.metadata.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        tags: project.metadata.tags || [],
        slug: project.slug,
        date: project.metadata.date,
    })).sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const filteredProjects = activeTags.length === 0
        ? allProjects
        : allProjects.filter(p => p.tags.some((t: string) => activeTags.includes(t)));

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    const allTags = Array.from(new Set(allProjects.flatMap(p => p.tags)));

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

                <PortfolioList 
                    projects={paginatedProjects} 
                    dict={dict} 
                    locale={typedLocale}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    activeTag={activeTags[0] || ''}
                    activeTags={activeTags}
                    allTags={allTags}
                />
            </div>
        </main>
    );
}



