const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 根據你的 tree 結構指向正確的 MitoFates.pl 路徑
const MITOFATES_ROOT = path.join(__dirname, '../MitoFates/script');
const MITOFATES_SCRIPT = path.join(MITOFATES_ROOT, 'MitoFates.pl');

app.use(express.static('public'));
app.use(express.json());

// API: 執行預測
app.post('/predict', upload.single('fastaFile'), (req, res) => {
    if (!req.file) return res.status(400).send('請上傳檔案');

    const filePath = path.resolve(req.file.path);
    const organism = req.body.organism || 'fungi';

    // 執行指令，並加上 PERL5LIB 確保 Perl 模組能被讀取
    const command = `export PERL5LIB=$PERL5LIB:${MITOFATES_ROOT}/bin/modules && perl ${MITOFATES_SCRIPT} ${filePath} ${organism}`;

    exec(command, { cwd: MITOFATES_ROOT }, (error, stdout, stderr) => {
        // 刪除暫存檔
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (error) {
            console.error(`執行錯誤: ${error}`);
            return res.status(500).json({ error: '模型執行失敗', details: stderr });
        }

        // 將 stdout 的文字結果轉成 JSON 格式
        const lines = stdout.trim().split('\n');
        const headers = lines[0].split('\t');
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            let obj = {};
            headers.forEach((header, i) => obj[header] = values[i] || '-');
            return obj;
        });

        res.json(data);
    });
});

app.listen(3000, () => {
    console.log('MitoFates 伺服器已啟動：http://localhost:3000');
});
