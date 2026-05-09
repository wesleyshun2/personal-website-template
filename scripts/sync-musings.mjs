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
 
// Helper to format date to YYYY-MM-DD HH:mm (Asia/Taipei)
function formatDate(isoString) {
    const d = new Date(isoString);
    // 取得台灣時間 (UTC+8)
    const twDate = new Date(d.getTime() + (8 * 60 * 60 * 1000));
    const pad = (n) => String(n).padStart(2, '0');
    
    const year = twDate.getUTCFullYear();
    const month = pad(twDate.getUTCMonth() + 1);
    const day = pad(twDate.getUTCDate());
    const hours = pad(twDate.getUTCHours());
    const minutes = pad(twDate.getUTCMinutes());
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
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
    if (!fs.existsSync(localePath)) {
        console.log(`📁 Creating missing directory: ${localePath}`);
        fs.mkdirSync(localePath, { recursive: true });
    }

    console.log(`\n🌐 [Locale: ${locale}] Processing...`);

    // 1. Get Source from src/config/site.ts
    const siteConfigPath = path.join(__dirname, '../src/config/site.ts');
    let sourceUrl = null;
    if (fs.existsSync(siteConfigPath)) {
        const siteConfigContent = fs.readFileSync(siteConfigPath, 'utf8');
        // Match the URL for the specific locale, e.g. tw: 'https://...'
        const regex = new RegExp(`${locale}:\\s*['"]([^'"]+)['"]`);
        const match = siteConfigContent.match(regex);
        if (match) {
            sourceUrl = match[1];
        }
    }

    if (!sourceUrl) {
        console.warn(`⚠️  No sourceUrl defined in src/config/site.ts for locale '${locale}'. Skipping.`);
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
            let video = '';
            let videoThumbnail = '';
            let youtube = '';
            let linkPreview = null;

            // Detect YouTube in text
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const ytMatch = content.match(youtubeRegex);
            if (ytMatch) {
                youtube = ytMatch[0];
            }

            let embed = post.embed;
            // Handle Record with Media (e.g. quote post with image/video)
            if (embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
                embed = embed.media;
            }

            if (embed?.$type === 'app.bsky.embed.images#view') {
                image = embed.images[0]?.fullsize || '';
            }

            if (embed?.$type === 'app.bsky.embed.video#view') {
                video = embed.playlist || '';
                videoThumbnail = embed.thumbnail || '';
            }

            if (embed?.$type === 'app.bsky.embed.external#view') {
                const external = embed.external;
                linkPreview = {
                    url: external.uri,
                    title: external.title,
                    description: external.description,
                    image: external.thumb
                };
            }

            // Construct Markdown
            let mdContent = '---\n';
            mdContent += `date: "${formatDate(postDate)}"\n`;
            if (image) mdContent += `image: "${image}"\n`;
            if (video) mdContent += `video: "${video}"\n`;
            if (videoThumbnail) mdContent += `videoThumbnail: "${videoThumbnail}"\n`;
            if (youtube) mdContent += `youtube: "${youtube}"\n`;
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
