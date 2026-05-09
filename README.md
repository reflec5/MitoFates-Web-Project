# MitoFates Web Service (重製版)

這是一個將經典生物資訊工具 **MitoFates** 現代化的 Web 專案。透過 Node.js 重新封裝 Perl 核心腳本，並提供直觀的任務管理與數據視覺化介面。

## 🌟 核心功能
- **Task ID 任務管理**：每個分析請求擁有唯一 ID 與獨立結果網址。
- **數據視覺化**：自動將機率數值轉化為直觀的進度條與顏色標註。
- **整合式引擎**：內建完整 MitoFates 執行環境，下載後即可運行。
- **自動清理機制**：背景自動刪除過期任務，節省伺服器空間。

## 🚀 快速啟動
1. 安裝環境需求：Node.js, Perl, libsvm-tools。
2. 進入專案目錄：`cd mitofates-web`
3. 安裝依賴：`npm install`
4. 啟動服務：`node server.js`
5. 瀏覽器訪問：`http://localhost:3000`

## 📂 專案架構
- `mitofates-web/`: Node.js 後端與 Web 介面。
- `MitoFates/`: 核心預測腳本與模型資料。
- `results/`: 使用者分析紀錄 (已排除在版本控制外)。
