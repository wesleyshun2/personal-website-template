import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n-config';

const contentDirectory = path.join(process.cwd(), 'content');

export function getMarkdownContent(locale: Locale, slug: string) {
    const fullPath = path.join(contentDirectory, locale, `${slug}.md`);

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return { data, content };
    } catch (e) {
        return { data: {}, content: null };
    }
}

export function getAllContentSlugs(locale: Locale, category: string = '') {
    const dirPath = path.join(contentDirectory, locale, category);

    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}
