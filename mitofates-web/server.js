const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 設定 MitoFates 腳本路徑
const MITOFATES_ROOT = path.join(__dirname, '../MitoFates/script');
const MITOFATES_SCRIPT = path.join(MITOFATES_ROOT, 'MitoFates.pl');
const RESULTS_DIR = path.join(__dirname, 'results');

// 初始化：檢查並建立結果資料夾
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR);
    console.log('✅ 已建立 results 資料夾');
}

app.use(express.static('public'));
app.use(express.json());

// ---------------------------------------------------------
// [自動清理機制] 每小時執行一次，刪除 14 天前的 JSON 檔案
// ---------------------------------------------------------
const CLEANUP_INTERVAL = 60 * 60 * 1000; 
const EXPIRATION_TIME = 14 * 24 * 60 * 60 * 1000; 

setInterval(() => {
    console.log('🧹 執行背景清理：正在掃描過期任務...');
    fs.readdir(RESULTS_DIR, (err, files) => {
        if (err) return;
        files.forEach(file => {
            const filePath = path.join(RESULTS_DIR, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                if (Date.now() - stats.mtimeMs > EXPIRATION_TIME) {
                    fs.unlink(filePath, () => console.log(`🗑️ 已刪除過期任務：${file}`));
                }
            });
        });
    });
}, CLEANUP_INTERVAL);

// ---------------------------------------------------------
// [路由與 API]
// ---------------------------------------------------------

app.get('/result/:taskId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

app.get('/api/result/:taskId', (req, res) => {
    const resultPath = path.join(RESULTS_DIR, `${req.params.taskId}.json`);
    if (fs.existsSync(resultPath)) {
        res.sendFile(resultPath);
    } else {
        res.status(404).json({ error: '任務不存在或結果已過期' });
    }
});

app.post('/predict', upload.single('fastaFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: '未接收到資料' });

    const taskId = crypto.randomBytes(8).toString('hex');
    const filePath = path.resolve(req.file.path);
    const organism = req.body.organism || 'fungi';

    const command = `export PERL5LIB=$PERL5LIB:${MITOFATES_ROOT}/bin/modules && export PATH=$PATH:/usr/bin && perl ${MITOFATES_SCRIPT} ${filePath} ${organism}`;

    console.log(`[${taskId}] 開始分析...`);

    exec(command, { cwd: MITOFATES_ROOT, maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (error) {
            console.error(`執行錯誤: ${error}`);
            return res.status(500).json({ error: '引擎執行失敗', details: stderr });
        }

        try {
            const lines = stdout.trim().split('\n');
            if (lines.length < 2) return res.status(500).json({ error: '輸出格式異常' });

            const headers = lines[0].split('\t').map(h => h.trim());
            const results = lines.slice(1).map(line => {
                const values = line.split('\t');
                let obj = {};
                headers.forEach((h, i) => obj[h] = values[i] ? values[i].trim() : '-');
                return obj;
            });

            const taskData = {
                taskId,
                createTime: new Date().toISOString(),
                organism,
                data: results
            };

            fs.writeFileSync(path.join(RESULTS_DIR, `${taskId}.json`), JSON.stringify(taskData, null, 2));
            res.json({ taskId });

        } catch (e) {
            res.status(500).json({ error: '解析失敗' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('===========================================');
    console.log(`🚀 服務運行中: http://localhost:${PORT}`);
    console.log('===========================================');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 錯誤：Port ${PORT} 已被佔用。請執行 'fuser -k ${PORT}/tcp' 後再重啟。`);
        process.exit(1);
    }
});
