const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test_assets');
// Valid PNG buffer
const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 
    0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 
    0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);
const VALID_PNG_PATH = path.join(TEST_DIR, 'mgmt_test.png');
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);
fs.writeFileSync(VALID_PNG_PATH, validPngBuffer);

function request(url, options = {}, fileData = null) {
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
                `Content-Disposition: form-data; name="image"; filename="${fileName}"\r\n` +
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

        // 1. Upload
        console.log('\n[1] Uploading mgmt_test.png...');
        const uploadRes = await request('http://localhost:5001/api/media/upload', { headers, method: 'POST' }, { filePath: VALID_PNG_PATH, contentType: 'image/png' });
        console.log(`Status: ${uploadRes.status}`);
        if (uploadRes.status !== 200) throw new Error('Upload failed');
        
        const fileUrl = uploadRes.data.imageUrl;
        const urlObj = new URL(fileUrl);
        const relativePath = urlObj.pathname.substring(1);
        console.log(`Uploaded: ${relativePath}`);

        // 2. Rename (Success)
        console.log('\n[2] Renaming to renamed_test.png...');
        const renameRes = await request('http://localhost:5001/api/media', { headers, method: 'PUT', body: JSON.stringify({
            oldPath: relativePath,
            newName: 'renamed_test.png'
        })});
        console.log(`Status: ${renameRes.status}`);
        if(renameRes.status === 200) console.log(`Renamed URL: ${renameRes.data.url}`);
        else console.error(renameRes.data);

        // 3. Rename (Fail - Ext Change)
        console.log('\n[3] Renaming to invalid.txt (Should Fail)...');
        const renameFailRes = await request('http://localhost:5001/api/media', { headers, method: 'PUT', body: JSON.stringify({
            oldPath: 'uploads/' + new Date().getFullYear() + '/' + String(new Date().getMonth() + 1).padStart(2,'0') + '/' + String(new Date().getDate()).padStart(2,'0') + '/renamed_test.png', // Assuming today
            newName: 'invalid.txt'
        })});
        console.log(`Status: ${renameFailRes.status} (Expected 400)`);
        console.log(renameFailRes.data);

        // Get updated path for delete (it's in the same folder)
        const dir = path.dirname(relativePath);
        const renamedPath = dir + '/renamed_test.png';

        // 4. Delete
        console.log(`\n[4] Deleting ${renamedPath}...`);
        const delRes = await request('http://localhost:5001/api/media', { headers, method: 'DELETE', body: JSON.stringify({
            filePath: renamedPath
        })});
        console.log(`Status: ${delRes.status}`);
        console.log(delRes.data);

    } catch (e) {
        console.error('Test Failed:', e);
    }
};

run();
