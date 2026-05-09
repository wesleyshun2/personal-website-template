import os
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from markdownify import markdownify as md

base_url = "https://fabacademy.org/2019/labs/taipei/students/weng-weisung/assignments/"
output_dir = r"c:\Users\Adata-W11\.gemini\antigravity\scratch\personal-website\content\tw\portfolio"
images_dir = os.path.join(output_dir, "images")

os.makedirs(images_dir, exist_ok=True)

weeks = [
    ("week01", "1. Principles and practices"),
    ("week02", "2. Project management"),
    ("week03", "3. Computer Aided design"),
    ("week04", "4. Computer controlled cutting"),
    ("week05", "5. Electronics production"),
    ("week06", "6. 3D Scanning and printing"),
    ("week07", "7. Electronics design"),
    ("week08", "8. Computer controlled machining"),
    ("week09", "9. Embedded programming"),
    ("week10", "10. Molding and casting"),
    ("week11", "11. Input devices"),
    ("week12", "12. Output devices"),
    ("week13", "13. Applications and implications"),
    ("week14", "14. Networking and communications"),
    ("week15", "15. Mechanical design"),
    ("week16", "16. Interface and application programming"),
    ("week17", "17. Machine design"),
    ("week18", "18. Wildcard week"),
    ("week19", "19. Invention, intellectual property and income"),
    ("week20", "20. Project development"),
]

def download_image(img_url, week_id):
    try:
        ext = os.path.splitext(urllib.parse.urlparse(img_url).path)[1]
        if not ext: ext = ".jpg"
        filename = f"fab2019-{week_id}{ext}"
        filepath = os.path.join(images_dir, filename)
        
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as f:
            f.write(response.read())
        return f"images/{filename}"
    except Exception as e:
        print(f"Failed to download image {img_url}: {e}")
        return img_url

for week_id, title in weeks:
    url = f"{base_url}{week_id}/"
    print(f"Processing {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find main article content
            article = soup.find('article', class_='md-content__inner')
            if not article:
                article = soup.find('div', class_='md-content')
            if not article:
                article = soup.find('body')
            
            # Convert all img src and a href to absolute URLs
            for img in article.find_all('img'):
                if img.get('src'):
                    img['src'] = urllib.parse.urljoin(url, img['src'])
            for a in article.find_all('a'):
                if a.get('href'):
                    a['href'] = urllib.parse.urljoin(url, a['href'])
            for source in article.find_all('source'):
                if source.get('src'):
                    source['src'] = urllib.parse.urljoin(url, source['src'])
            for video in article.find_all('video'):
                if video.get('src'):
                    video['src'] = urllib.parse.urljoin(url, video['src'])
                    
            # Get the first image as representative image
            img_url = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800"
            first_img = article.find('img')
            local_img_path = img_url
            if first_img and first_img.get('src'):
                local_img_path = download_image(first_img['src'], week_id)
            
            # Convert html to markdown
            content_md = md(str(article), heading_style="ATX")
            
            # Build the final markdown file
            md_content = f"""---
title: "{title}"
description: "Fab Academy 2019 - {title}"
image: "{local_img_path}"
tags: ["Fab Academy", "Week {int(week_id[-2:])}"]
---

[查看完整專案紀錄（原網站）]({url})

{content_md}
"""
            
            file_name = f"fabacademy-2019-{week_id}.md"
            file_path = os.path.join(output_dir, file_name)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(md_content)
            
            print(f"Created {file_name}")
            
    except Exception as e:
        print(f"Failed to process {week_id}: {e}")
