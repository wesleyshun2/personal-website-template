import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { HeroParallax } from '@/components/HeroParallax';
import { SocialLinks } from '@/components/SocialLinks';
import { getAllContentWithMetadata } from '@/lib/mdx';
import { BlogList } from '@/components/BlogList';
import { MicroBlog } from '@/components/MicroBlog';
import microBlogPosts from '@/data/micro-blog.json';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);

  // Fetch Blog posts
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
    <main className="min-h-screen">
      <HeroParallax title={dict.home.title} subtitle={dict.home.subtitle}>
        <SocialLinks className="mt-8" />
      </HeroParallax>

      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <BlogList posts={posts} dict={dict} locale={typedLocale} />
          </div>
          <div className="lg:col-span-4">
            <MicroBlog posts={microBlogPosts} title={dict.blog.microBlogTitle} />
          </div>
        </div>
      </section>
    </main>
  );
}
