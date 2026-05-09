# MitoFates Web Service 

這是一個將 **MitoFates** 現代化的 Web 專案。透過 Node.js 重新封裝 Perl 核心腳本，並提供直觀的任務管理與數據視覺化介面。

---

## 🛠️ 環境需求 (Prerequisites)

本專案運行於 Linux 環境（建議使用 Ubuntu 20.04/22.04+），啟動前請執行以下指令安裝各項核心組件：

### 1. Node.js 執行環境
本專案後端使用 Node.js 開發，請確保已安裝 v14.x 以上版本：
```bash
# 安裝 Node.js 與 npm (以 Ubuntu 為例)
sudo apt update
sudo apt install -y nodejs npm
```

### 2. Perl 核心環境
MitoFates 的預測引擎基於 Perl 撰寫，需安裝系統環境與相關處理套件：
```bash
# 安裝 Perl 及其必要處理工具
sudo apt install -y perl gawk build-essential
```

### 3. 生物資訊與 SVM 工具
這是運行預測模型最關鍵的步驟，包含 SVM 分類器與必要的數學函式庫：
```bash
# 更新套件清單並安裝 SVM 工具與數學套件
sudo apt update
sudo apt install -y libsvm-tools libmath-cephes-perl libperl6-slurp-perl libinline-perl
```

## 🚀 安裝與啟動步驟

### 1. 取得專案與進入目錄
首先複製專案並進入網頁服務資料夾：
```bash
git clone [這個專案]
cd MitoFates-Web-Project/mitofates-web
```

### 2. 安裝 Node.js 套件
執行 npm 指令安裝 `server.js` 所需的依賴項目（如 Express, Multer 等）：
```bash
npm install
```

### 3. 配置系統指令連結 (Symlink)
由於原始 Perl 腳本預期呼叫 `svm_predict` (底線)，而 Ubuntu 套件安裝後的指令名稱為 `svm-predict` (橫線)，請執行以下指令建立連結：
```bash
sudo ln -sf /usr/bin/svm-predict /usr/bin/svm_predict
sudo ln -sf /usr/bin/svm-scale /usr/bin/svm_scale
```

### 4. 啟動服務
使用 Node.js 啟動後端伺服器：
```bash
node server.js
```

### 5. 瀏覽器訪問
服務啟動後，請於瀏覽器輸入網址即可開始使用：
👉 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 1. 提交預測任務
- **貼上序列 (FASTA)**：在首頁文字方塊中輸入標準蛋白質 FASTA 序列。
- **範例測試**：若無現成數據，可點擊 **「填入範例序列 (Example)」** 按鈕，系統會自動載入測試序列。
- **選擇生物模型**：根據您的蛋白來源選擇對應的模式：
    - `Fungi`：真菌類蛋白
    - `Metazoa`：動物/後生動物蛋白
    - `Plant`：植物類蛋白
- **執行**：點擊「提交並執行分析」，系統將顯示任務建立狀態。

### 2. 解析分析結果
- **自動跳轉**：分析完成後，系統會自動引導至專屬結果頁面。
- **視覺化指標**：
    - **Probability (機率)**：以動態進度條呈現，綠色代表高機率（>0.385），灰色代表低機率。
    - **Cleavage Site (切割位點)**：自動標註預測的線粒體標靶序列切割位置。
- **任務分享與保存**：
    - 每個任務都有唯一 URL（格式：`/result/[Task_ID]`）。
    - 您可以記錄此網址，結果將在伺服器保留 14 天供隨時回顧。

---

## 📂 專案架構與檔案說明
```text
.
├── MitoFates/           # 核心預測引擎 (由 Perl 撰寫)
│   ├── script/          # MitoFates.pl 主程式與相關 Modules
│   └── models/          # 預先訓練好的 SVM 模型資料
└── mitofates-web/       # Node.js 網頁服務架構
    ├── server.js        # 後端核心：處理 API 請求、執行背景清理、任務調度
    ├── public/          # 靜態資源 (HTML 介面與前端 JavaScript)
    │   ├── index.html   # 分析提交首頁
    │   └── result.html  # 獨立結果展示頁面
    ├── results/         # 儲存分析結果 JSON
    ├── uploads/         # 上傳序列暫存目錄 (分析完畢後自動刪除)
    └── package.json     # 專案依賴與腳本定義
```

