const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, '../test_assets');
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);

const VALID_PNG_PATH = path.join(TEST_DIR, 'blog_test.png');
if (!fs.existsSync(VALID_PNG_PATH)) {
    // Create a minimal valid PNG
    const buffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 
        0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 
        0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(VALID_PNG_PATH, buffer);
}

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
        if (!token) throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
        
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Upload Image
        console.log('\n[1] Uploading Image...');
        const uploadRes = await request('http://localhost:5001/api/blog/upload', { headers, method: 'POST' }, { filePath: VALID_PNG_PATH, contentType: 'image/png' });
        console.log(`Status: ${uploadRes.status}`);
        if (uploadRes.status !== 200) {
            console.error('Upload Failed:', uploadRes.data);
            return;
        }
        const imageUrl = uploadRes.data.imageUrl;
        console.log('Image URL:', imageUrl);

        // 2. Create Post
        console.log('\n[2] Creating Post...');
        const postData = {
            title: 'Test Post ' + Date.now(),
            slug: 'test-post-' + Date.now(),
            content: 'This is a test post content.',
            image: imageUrl,
            tags: ['test', 'debug'],
            published: true
        };
        const createRes = await request('http://localhost:5001/api/blog', { headers, method: 'POST', body: JSON.stringify(postData) });
        console.log(`Status: ${createRes.status}`);
        if (createRes.status === 201) {
            console.log('Post Created:', createRes.data._id);
        } else {
            console.error('Create Failed:', createRes.data);
            return;
        }
        
        const postId = createRes.data._id;

        // 3. Update Post
        console.log('\n[3] Updating Post...');
        const updateData = {
            title: 'Updated Test Post ' + Date.now(),
            content: 'Updated content.'
        };
        const updateRes = await request(`http://localhost:5001/api/blog/${postId}`, { headers, method: 'PUT', body: JSON.stringify(updateData) });
        console.log(`Status: ${updateRes.status}`);
        if (updateRes.status === 200) {
            console.log('Post Updated Successfully');
        } else {
             console.error('Update Failed:', updateRes.data);
        }
        
        // 4. Delete Post
        console.log('\n[4] Cleanup: Deleting Post...');
        await request(`http://localhost:5001/api/blog/${postId}`, { headers, method: 'DELETE' });

    } catch (e) {
        console.error('Error:', e);
    }
};

run();
