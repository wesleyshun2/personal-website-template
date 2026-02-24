import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { BlogList } from '@/components/BlogList';

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const typedLocale = locale as Locale;
    const dict = await getDictionary(typedLocale);

    const postsData = getAllContentWithMetadata(typedLocale, 'blog');

    const posts = postsData.map(post => ({
        title: post.metadata.title || 'Untitled',
        excerpt: post.metadata.excerpt || '',
        date: post.metadata.date || '',
        category: post.metadata.category || 'General',
        image: post.metadata.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
        slug: post.slug,
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

                <BlogList posts={posts} dict={dict} locale={typedLocale} />
            </div>
        </main>
    );
}



