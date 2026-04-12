const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 指向 MitoFates 的路徑
const MITOFATES_ROOT = path.join(__dirname, '../MitoFates/script');
const MITOFATES_SCRIPT = path.join(MITOFATES_ROOT, 'MitoFates.pl');

app.use(express.static('public'));
app.use(express.json());

// API: 執行預測
app.post('/predict', upload.single('fastaFile'), (req, res) => {
    // 檢查是否有檔案（或是由文字框轉成的 Blob）
    if (!req.file) {
        return res.status(400).json({ error: '未接收到序列資料，請貼上內容或上傳檔案' });
    }

    const filePath = path.resolve(req.file.path);
    // 確保這裡與 index.html 中的 <select name="organism"> 一致
    const organism = req.body.organism || 'fungi';

    // 執行指令邏輯：
    // 1. 設定 PERL5LIB 讓 Perl 找到 modules 資料夾
    // 2. 將 /usr/bin 加入 PATH 確保能執行 svm-predict (由 libsvm-tools 提供)
    // 3. 執行 MitoFates.pl
    const command = `export PERL5LIB=$PERL5LIB:${MITOFATES_ROOT}/bin/modules && export PATH=$PATH:/usr/bin && perl ${MITOFATES_SCRIPT} ${filePath} ${organism}`;

    console.log(`正在執行分析，模式：${organism}...`);

    exec(command, { cwd: MITOFATES_ROOT, maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
        // 立即刪除暫存檔，避免磁碟空間爆炸
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        if (error) {
            console.error(`執行錯誤: ${error}`);
            return res.status(500).json({ error: '核心引擎執行失敗', details: stderr });
        }

        try {
            const lines = stdout.trim().split('\n');
            
            // 基礎檢查：如果輸出行數太少，代表可能沒跑出結果
            if (lines.length < 2) {
                return res.status(500).json({ error: '模型輸出格式異常', details: stdout });
            }

            // 解析 Tab 分隔的標頭與內容
            const headers = lines[0].split('\t');
            const data = lines.slice(1).map(line => {
                const values = line.split('\t');
                let obj = {};
                headers.forEach((header, i) => {
                    // 清理標頭與內容的空白與換行
                    const key = header.trim();
                    const val = values[i] ? values[i].trim() : '-';
                    obj[key] = val;
                });
                return obj;
            });

            console.log('分析完成，回傳資料中');
            res.json(data);

        } catch (parseError) {
            console.error(`解析輸出失敗: ${parseError}`);
            res.status(500).json({ error: '解析結果失敗', details: stdout });
        }
    });
});

app.listen(3000, () => {
    console.log('-------------------------------------------');
    console.log('MitoFates 網頁後端服務已啟動');
    console.log('傳送門: http://localhost:3000');
    console.log('-------------------------------------------');
});
