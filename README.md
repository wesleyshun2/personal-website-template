# Personal Website Template

這是一個使用 [Next.js](https://nextjs.org/) 和 [Tailwind CSS](https://tailwindcss.com/) 打造的高質感個人網站模板，內建深色/淺色模式、雙語言支援，並透過 Markdown 來管理網站的動態內容。

## ✨ 核心功能 (Features)

- **優雅的視覺設計**：支援深色/淺色模式切換，並帶有絕美的玻璃擬物 (Glassmorphism) 特效。
- **基於 Markdown 的內容管理**：無須資料庫，只要編輯 `content/` 資料夾內的 `.md` 檔案，即可輕鬆更新履歷、部落格與作品集。
- **多語系支援 (i18n)**：內建英文 (`en`) 與繁體中文 (`tw`) 雙語系，架構容易擴展。
- **動態隨想 (Musings) 同步**：內建客製化腳本，能自動同步您的 BlueSky 貼文至網站，當作個人的微網誌。

## 📸 效果預覽

![效果預覽](effect.png)


---

## 🚀 快速開始 (Getting Started)

1. **安裝環境依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

3. 開啟瀏覽器並前往 [http://localhost:3000](http://localhost:3000) 預覽您的網站。

---

## 📖 操作說明 (How to Operate)

### 1. 網站基礎設定 (Site Configuration)
網站的核心設定皆集中於 `src/config/site.ts` 檔案中：
- **調整玻璃特效**：可在 `hero` 區塊下修改 Tailwind CSS 屬性（包含 `glassBlur`、`glassOpacityLight`、`glassOpacityDark`），細微調整網站的視覺感受。
- **設定 BlueSky 來源**：若是想同步您的微網誌，請在 `musings.sources` 中替換為您的 BlueSky 個人首頁連結。

### 2. 內容修改與發布 (Content Management)
所有的文字與文章內容都存放在 `content/` 資料夾內，並依據語系（如 `en/`、`tw/`）進行分類：
- **單一頁面介紹**：直接編輯對應語系資料夾中的 `about.md` (關於我) 或 `resume.md` (履歷表)。
- **發表部落格 (Blog) 與作品集 (Portfolio)**：進入 `blog/` 或 `portfolio/` 目錄，新增 Markdown 檔案即可。檔案開頭需包含 YAML Frontmatter（如標題、日期、描述等），網站將會自動讀取並渲染。

### 3. 同步 BlueSky 隨想 (Syncing Musings)
此模板幫助您將社交媒體上的簡短想法無縫搬移至個人網站。
操作流程：
1. 請先確保已在 `src/config/site.ts` 寫入您的 BlueSky 連結。
2. 在終端機執行同步指令：
   ```bash
   npm run sync-musings
   ```
3. 執行後，腳本會自動連線取得最新發文，並將其轉換成 `.md` 檔案，自動放置到 `content/[locale]/musings/` 資料夾中。

---

## 📦 部署發布 (Deployment)

本專案建議透過 [Vercel](https://vercel.com/) 進行部署，能達到最佳的 Next.js 運行效能：
1. 將完整的專案推送到您的 GitHub。
2. 進入 Vercel，匯入該 GitHub 存儲庫，Vercel 將會自動識別並一鍵完成建置。

---

## 📄 授權 (License)

This project is licensed under the [MIT License](LICENSE).
