const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, '../test_assets');
const VALID_TXT_PATH = path.join(TEST_DIR, 'test.txt');
if (!fs.existsSync(VALID_TXT_PATH)) fs.writeFileSync(VALID_TXT_PATH, 'This is a valid text file.');

function request(url, options = {}, fileData = null, fieldName = 'file') {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const params = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };
        let body = Buffer.alloc(0);

        if (fileData) {
            const { filePath, contentType } = fileData;
            const fileName = path.basename(filePath);
            const fileContent = fs.readFileSync(filePath);
            const pre = Buffer.from(
                `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\n` +
                `Content-Type: ${contentType}\r\n\r\n`
            );
            const post = Buffer.from(`\r\n--${boundary}--\r\n`);
            body = Buffer.concat([pre, fileContent, post]);
            params.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
            params.headers['Content-Length'] = body.length;
        } else if (options.body) {
             body = Buffer.from(options.body);
             params.headers['Content-Type'] = 'application/json';
             params.headers['Content-Length'] = body.length;
        }

        const req = http.request(params, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                console.log('Response Body:', resBody);
                try {
                    const parsed = JSON.parse(resBody);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: resBody });
                }
            });
        });

        req.on('error', reject);
        if (body.length > 0) req.write(body);
        req.end();
    });
}

const run = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await request('http://localhost:5001/api/auth/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'password123' }) });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('Uploading TXT...');
        const res = await request('http://localhost:5001/api/files/upload', { headers, method: 'POST' }, { filePath: VALID_TXT_PATH, contentType: 'text/plain' }, 'file');
        console.log('Status:', res.status);
    } catch (e) {
        console.error(e);
    }
};

run();
