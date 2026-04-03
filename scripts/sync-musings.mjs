import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_ROOT = path.join(__dirname, '../content');

// Helper to parse frontmatter manually
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    const yaml = match[1];
    const data = {};
    yaml.split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) {
            data[key.trim()] = value.join(':').trim().replace(/^["']|["']$/g, '');
        }
    });
    return data;
}

// Handler for BlueSky
async function fetchBlueSky(handle, latestDate) {
    const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=30`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`BlueSky API Error: ${response.status}`);
    const data = await response.json();
    
    return data.feed.filter(item => {
        if (item.reason) return false; // Skip reposts
        const postDate = new Date(item.post.record.createdAt);
        return postDate > latestDate;
    }).reverse();
}

async function syncLocale(locale) {
    const localePath = path.join(CONTENT_ROOT, locale, 'musings');
    if (!fs.existsSync(localePath)) return;

    console.log(`\n🌐 [Locale: ${locale}] Processing...`);

    // 1. Get Source
    const configPath = path.join(CONTENT_ROOT, locale, 'musings-config.md');
    if (!fs.existsSync(configPath)) {
        console.warn(`⚠️  No musings-config.md found for ${locale}. Skipping.`);
        return;
    }
    const sourceContent = fs.readFileSync(configPath, 'utf8');
    const sourceMeta = parseFrontmatter(sourceContent);
    const sourceUrl = sourceMeta.sourceUrl;

    if (!sourceUrl) {
        console.warn(`⚠️  No sourceUrl defined in ${locale}/source.md. Skipping.`);
        return;
    }

    // 2. Detect Service
    if (sourceUrl.includes('x.com') || sourceUrl.includes('twitter.com')) {
        console.warn(`ℹ️  X/Twitter source detected for ${locale}. Automated sync for X is currently not supported.`);
        return;
    }

    if (!sourceUrl.includes('bsky.app')) {
        console.warn(`⚠️  Unsupported source URL for ${locale}: ${sourceUrl}`);
        return;
    }

    const handle = sourceUrl.split('/').pop();
    console.log(`🔗 Tracking BlueSky: ${handle}`);

    // 3. Find latest local post
    const files = fs.readdirSync(localePath).filter(f => f.startsWith('musing-') && f.endsWith('.md'));
    let maxN = 0;
    let latestDate = new Date(0);

    files.forEach(file => {
        const n = parseInt(file.replace('musing-', '').replace('.md', ''));
        if (n > maxN) maxN = n;
        
        const content = fs.readFileSync(path.join(localePath, file), 'utf8');
        const meta = parseFrontmatter(content);
        if (meta.date) {
            const d = new Date(meta.date);
            if (d > latestDate) latestDate = d;
        }
    });

    console.log(`📂 Current state: Max Index = ${maxN}, Latest Date = ${latestDate.toISOString()}`);

    // 4. Fetch New Posts
    try {
        const newPosts = await fetchBlueSky(handle, latestDate);
        console.log(`✨ Found ${newPosts.length} new posts for ${locale}.`);

        let currentIdx = maxN;
        for (const item of newPosts) {
            currentIdx++;
            const post = item.post;
            const record = post.record;
            const postDate = record.createdAt;
            
            let content = record.text || '';
            let image = '';
            let linkPreview = null;

            if (post.embed && post.embed.$type === 'app.bsky.embed.images#view') {
                image = post.embed.images[0]?.fullsize || '';
            }

            if (post.embed && post.embed.$type === 'app.bsky.embed.external#view') {
                const external = post.embed.external;
                linkPreview = {
                    url: external.uri,
                    title: external.title,
                    description: external.description,
                    image: external.thumb
                };
            }

            // Construct Markdown
            let mdContent = '---\n';
            mdContent += `date: "${postDate}"\n`;
            if (image) mdContent += `image: "${image}"\n`;
            if (linkPreview) {
                mdContent += `linkPreview:\n`;
                mdContent += `  url: "${linkPreview.url}"\n`;
                mdContent += `  title: "${linkPreview.title}"\n`;
                mdContent += `  description: "${linkPreview.description}"\n`;
                mdContent += `  image: "${linkPreview.image}"\n`;
            }
            mdContent += '---\n\n';
            mdContent += content;

            const fileName = `musing-${currentIdx}.md`;
            fs.writeFileSync(path.join(localePath, fileName), mdContent);
            console.log(`✅ Saved ${fileName} in ${locale}`);
        }
    } catch (error) {
        console.error(`❌ Sync failed for ${locale}:`, error.message);
    }
}

async function runSync() {
    console.log('🚀 Starting Multi-Locale Synchronization...');
    
    if (!fs.existsSync(CONTENT_ROOT)) {
        console.error('❌ Content root directory not found.');
        return;
    }

    const locales = fs.readdirSync(CONTENT_ROOT).filter(f => fs.statSync(path.join(CONTENT_ROOT, f)).isDirectory());
    
    for (const locale of locales) {
        await syncLocale(locale);
    }

    console.log('\n🎉 All locales processed.');
}

runSync();
