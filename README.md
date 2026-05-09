# MitoFates Web Service 

這是一個將 **MitoFates** 現代化的 Web 專案。透過 Node.js 重新封裝 Perl 核心腳本，並提供直觀的任務管理與數據視覺化介面。

---

## 🛠️ 環境需求 (Prerequisites)
本專案運行於 Linux 環境（建議 Ubuntu/Debian），請確保已安裝以下組件：

1. **Node.js**: v14.x 或更高版本。
2. **Perl**: 系統內建 Perl 5 即可。
3. **SVM-light 依賴**: 
   ```bash
   # 安裝 svm-predict 所需工具
   sudo apt update
   sudo apt install libsvm-tools build-essential
   ```
4. **Perl 模組**: 確保環境支援 `Math::Cephes` 與 `Inline::C` 相關相依。

## 🚀 安裝與啟動步驟

1. 進入專案目錄：`cd mitofates-web`
2. 安裝依賴：`npm install`
3. 啟動服務：`node server.js`
4. 瀏覽器訪問：`http://localhost:3000`

## 📖 使用指南

### 1. 提交分析
- **貼上序列**：在首頁文字框中輸入標準 FASTA 格式序列。
- **範例測試**：點擊「填入範例序列」可快速載入測試數據。
- **選擇模型**：根據蛋白來源選擇 `Fungi` (真菌), `Metazoa` (動物) 或 `Plant` (植物)。

### 2. 查看結果
- 分析完成後，系統將自動跳轉至專屬結果頁面。
- **URL 格式**: `http://localhost:3000/result/[Task_ID]`
- 您可以複製此網址以便日後查看或分享分析報告。

## 📂 專案架構
```text
.
├── MitoFates/           # 核心 Perl 預測引擎與模型資料
└── mitofates-web/
    ├── server.js        # Node.js 主程式 (API 路由與任務調度)
    ├── results/         # [自動生成] 儲存 JSON 分析結果 (已透過 .gitignore 排除)
    ├── uploads/         # [自動生成] 上傳序列暫存區
    └── public/          # 前端網頁介面 (index.html, result.html)
```

---

