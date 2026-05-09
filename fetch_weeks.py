import urllib.request
import urllib.parse
import re
import os

base_url = "https://fabacademy.org/2019/labs/taipei/students/weng-weisung/assignments/"

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

output_dir = r"c:\Users\Adata-W11\.gemini\antigravity\scratch\personal-website\content\tw\portfolio"

fallback_image = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800"

for week_id, title in weeks:
    url = f"{base_url}{week_id}/"
    print(f"Fetching {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            img_match = re.search(r'<img[^>]+src="([^"]+)"', html)
            img_url = fallback_image
            if img_match:
                src = img_match.group(1)
                img_url = urllib.parse.urljoin(url, src)
            
            md_content = f"""---
title: "{title}"
description: "Fab Academy 2019 - {title}"
image: "{img_url}"
tags: ["Fab Academy", "Week {int(week_id[-2:])}"]
---

這是在 Fab Academy 2019 第 {int(week_id[-2:])} 週的專案紀錄：{title}。

## 專案內容
- [點此查看完整專案紀錄（原網站）]({url})
"""
            
            file_name = f"fabacademy-2019-{week_id}.md"
            file_path = os.path.join(output_dir, file_name)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(md_content)
            
            print(f"Created {file_name}")
            
    except Exception as e:
        print(f"Failed to fetch {week_id}: {e}")
