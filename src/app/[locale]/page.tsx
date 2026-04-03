import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import { HeroParallax } from '@/components/HeroParallax';
import { SocialLinks } from '@/components/SocialLinks';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { BlogList } from '@/components/BlogList';
import { Musings } from '@/components/Musings';
import { fetchExternalSourceData } from '@/lib/tweetFetcher';
import { siteConfig } from '@/config/site';

export default async function Home({
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
  const currentCategory = category || dict.blog.all;
  const postsPerPage = 4;

  // Fetch Blog posts
  const allPostsData = getAllContentWithMetadata(typedLocale, 'blog');
  const allPosts = allPostsData.map(post => ({
    title: post.metadata.title || 'Untitled',
    excerpt: post.metadata.excerpt || '',
    date: post.metadata.date || '',
    category: post.metadata.category || 'General',
    image: post.metadata.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    slug: post.slug,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPosts = currentCategory === dict.blog.all
      ? allPosts
      : allPosts.filter(p => p.category === currentCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
  );

  const rawMusingsData = getAllContentWithMetadata(typedLocale, 'musings');
  // Now using siteConfig for sourceUrl instead of fetching from MDX metadata
  const sourceUrl = siteConfig.musings.sources[typedLocale as keyof typeof siteConfig.musings.sources] || siteConfig.musings.sources.en;

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
    <main className="min-h-screen">
      <HeroParallax title={dict.home.title} subtitle={dict.home.subtitle}>
        <SocialLinks className="mt-8" />
      </HeroParallax>

      <section id="blog-section" className="container mx-auto px-6 pt-24 pb-12 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <BlogList 
              posts={paginatedPosts} 
              dict={dict} 
              locale={typedLocale} 
              currentPage={currentPage}
              totalPages={totalPages}
              currentCategory={currentCategory}
              allCategories={Array.from(new Set(allPosts.map(p => p.category)))}
              showFilters={true}
              showPagination={true}
              scrollTarget="blog-section"
            />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <Musings 
              posts={musingsPosts} 
              title={dict.blog.musingsTitle} 
              sourceUrl={sourceUrl}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
