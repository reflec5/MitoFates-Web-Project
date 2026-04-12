# MitoFates Web Service

## 🛠️ 環境需求與安裝清單

### 1. 系統依賴 (Ubuntu/Linux)
在運行本專案前，請務必於伺服器安裝以下核心組件：

```bash
# 更新套件清單
sudo apt update

# 安裝 SVM 工具、文字處理器與數學函式庫
sudo apt install -y libsvm-tools gawk libmath-cephes-perl libperl6-slurp-perl libinline-perl build-essential

# 修正部分系統中指令命名不一致的問題
sudo ln -sf /usr/bin/svm-scale /usr/bin/svm_scale
sudo ln -sf /usr/bin/svm-predict /usr/bin/svm_predict
```

### 2. Node.js 環境
- **Node.js**: 建議 v18.0.0 以上版本。
- **依賴套件**: `express`, `multer`。

## 🚀 快速啟動手冊

1. **取得專案與安裝套件**
   ```bash
   git clone [您的 Repository 網址]
   cd mitofates-web
   npm install
   ```

2. **建立必要資料夾**
   確保後端有存放暫存檔的空間：
   ```bash
   mkdir uploads
   ```

3. **啟動伺服器**
   ```bash
   node server.js
   ```

4. **訪問服務**
   打開瀏覽器輸入：`http://localhost:3000`

## 📖 使用指南
- **上傳檔案**：支援標準 FASTA 格式的蛋白質序列檔案。
- **選擇模式**：
  - `Fungi`: 適用於真菌類（如酵母菌）蛋白質。
  - `Metazoa`: 適用於動物類蛋白質。
  - `Plant`: 適用於植物類蛋白質。
- **結果解讀**：
  - **MTS 評分**：機率（Probability）大於 **0.385** 即視為具有顯著導向訊號。
  - **切割位點**：提供 MPP、Icp55 及 Oct1 等蛋白酶的預測位點。

## 📂 資料夾結構
- `/MitoFates`: 存放原始 Perl 核心腳本與模型權重檔案。
- `/mitofates-web`: 存放 Node.js 後端 API 與 `public` 前端介面。
- `/mitofates-web/uploads`: 處理任務時產生的 FASTA 序列暫存區。
