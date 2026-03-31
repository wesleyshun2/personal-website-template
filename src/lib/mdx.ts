import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n-config';

const contentDirectory = path.join(process.cwd(), 'content');

export function getMarkdownContent(locale: Locale, slug: string, category: string = '') {
    const fullPath = path.join(contentDirectory, locale, category, `${slug}.md`);

    try {
        if (!fs.existsSync(fullPath)) return { data: {}, content: null };
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return { data, content };
    } catch (e) {
        return { data: {}, content: null };
    }
}

export function getAllContentWithMetadata(locale: Locale, category: string) {
    const dirPath = path.join(contentDirectory, locale, category);

    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(dirPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            return {
                slug,
                metadata: data,
                content: content,
            };
        });
}

export function getAllContentSlugs(locale: Locale, category: string = '') {
    const dirPath = path.join(contentDirectory, locale, category);

    if (!fs.existsSync(dirPath)) return [];

    const fileNames = fs.readdirSync(dirPath);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}

