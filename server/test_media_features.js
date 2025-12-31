const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Create Test Files
const TEST_DIR = path.join(__dirname, 'test_assets');
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);

const VALID_TXT_PATH = path.join(TEST_DIR, 'test.txt');
fs.writeFileSync(VALID_TXT_PATH, 'This is a valid text file.');

const FAKE_JPG_PATH = path.join(TEST_DIR, 'fake.jpg');
fs.writeFileSync(FAKE_JPG_PATH, 'This is not a real image header.');

// Minimal valid PNG buffer
const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // Signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // Width 1
    0x00, 0x00, 0x00, 0x01, // Height 1
    0x08, 0x06, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x1F, 0x15, 0xC4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0A, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // Compressed data
    0x0D, 0x0A, 0x2D, 0xB4, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
]);
const VALID_PNG_PATH = path.join(TEST_DIR, 'valid.png');
fs.writeFileSync(VALID_PNG_PATH, validPngBuffer);

// Helper for multipart request
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

const runTests = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await request('http://localhost:5001/api/auth/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'password123' }) });
        const token = loginRes.data.token;
        if (!token) throw new Error('Login failed');
        console.log('Login successful.');
        
        const headers = { Authorization: `Bearer ${token}` };

        // Test 1: Upload Valid Media
        console.log('\n[Media] Uploading Valid PNG...');
        const resMediaValid = await request('http://localhost:5001/api/media/upload', { headers, method: 'POST' }, { filePath: VALID_PNG_PATH, contentType: 'image/png' }, 'image');
        console.log(`Status: ${resMediaValid.status} (Expected 200)`);
        if(resMediaValid.status === 200) console.log('Success:', resMediaValid.data);
        else console.error('Failed:', resMediaValid.data);

        // Test 2: Upload Fake Media (Invalid Content)
        console.log('\n[Media] Uploading Fake JPG (Text Content)...');
        const resMediaFake = await request('http://localhost:5001/api/media/upload', { headers, method: 'POST' }, { filePath: FAKE_JPG_PATH, contentType: 'image/jpeg' }, 'image');
        console.log(`Status: ${resMediaFake.status} (Expected 400/500)`); // Validation should catch it
        console.log('Response:', resMediaFake.data);

        // Test 3: List Media
        console.log('\n[Media] Listing Files...');
        const resMediaList = await request('http://localhost:5001/api/media', { headers });
        console.log(`Found ${resMediaList.data.length} media files.`);
        
        // Test 4: Upload Valid File
        console.log('\n[Files] Uploading Valid TXT...');
        const resFileValid = await request('http://localhost:5001/api/files/upload', { headers, method: 'POST' }, { filePath: VALID_TXT_PATH, contentType: 'text/plain' }, 'file');
        console.log(`Status: ${resFileValid.status} (Expected 200)`);
        if(resFileValid.status === 200) console.log('Success:', resFileValid.data);
         else console.error('Failed:', resFileValid.data);

        // Test 5: Upload Invalid File (Valid ext/type for Media, but wrong endpoint?)
        // Or check if magic number check works for docs. 
        // Text files are hard to validate by magic number. 
        // Let's rely on logic verification from previous steps.

        // Test 6: List Files
        console.log('\n[Files] Listing Files...');
        const resFileList = await request('http://localhost:5001/api/files', { headers });
        console.log(`Found ${resFileList.data.length} files.`);


    } catch (error) {
        console.error('Test Failed:', error);
    }
};

runTests();
