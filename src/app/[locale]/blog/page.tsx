import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { BlogList } from '@/components/BlogList';
import { Musings } from '@/components/Musings';
import { fetchExternalSourceData } from '@/lib/tweetFetcher';

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const { locale } = await params;
    const { page, category } = await searchParams;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const activeCategories = category ? category.split(',') : [];
    const postsPerPage = 6;

    const allPostsData = getAllContentWithMetadata(typedLocale, 'blog');

    const allPosts = allPostsData.map(post => ({
        title: post.metadata.title || 'Untitled',
        excerpt: post.metadata.excerpt || '',
        date: post.metadata.date || '',
        category: post.metadata.category || 'General',
        image: post.metadata.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
        slug: post.slug,
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredPosts = activeCategories.length === 0
        ? allPosts
        : allPosts.filter(p => activeCategories.includes(p.category));

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const rawMusingsData = getAllContentWithMetadata(typedLocale, 'musings');
    const sourceNode = rawMusingsData.find(post => post.slug === 'source');
    const sourceUrl = sourceNode?.metadata?.sourceUrl || '';
    const externalSourceData = sourceUrl ? await fetchExternalSourceData(sourceUrl) : null;

    const musingsPosts = rawMusingsData
        .filter(post => post.slug !== 'source' && post.content.trim() !== '.')
        .map(post => ({
            id: post.slug,
            content: post.content ? post.content.trim() : '',
            date: post.metadata.date || '',
            image: post.metadata.image,
            youtube: post.metadata.youtube,
            linkPreview: post.metadata.linkPreview,
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <header className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                        {dict.blog.title}
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                        {dict.blog.subtitle}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <BlogList 
                            posts={paginatedPosts} 
                            dict={dict} 
                            locale={typedLocale}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            activeCategories={activeCategories}
                            allCategories={Array.from(new Set(allPosts.map(p => p.category)))}
                        />
                    </div>
                    <div className="lg:col-span-4 flex flex-col">
                        <Musings 
                            posts={musingsPosts} 
                            title={dict.blog.musingsTitle} 
                            sourceUrl={sourceUrl} 
                            externalSourceData={externalSourceData} 
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}



