const http = require('http');

const request = (url, options = {}, data = null) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const params = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        if (data) {
            params.headers['Content-Type'] = 'application/json';
            params.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = http.request(params, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(data);
        }
        req.end();
    });
};

const testAdminFilters = async () => {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginData = JSON.stringify({
            username: 'admin',
            password: 'password123'
        });
        
        const loginRes = await request('http://localhost:5001/api/auth/login', { method: 'POST' }, loginData);
        
        if (!loginRes.data.token) {
             throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
        }

        const token = loginRes.data.token;
        console.log('Login successful.');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test Pagination (Limit 20)
        console.log('\nTesting Pagination (Limit 20)...');
        const resPagination = await request('http://localhost:5001/api/blog/admin?page=1&limit=20', { headers });
        console.log(`Fetched ${resPagination.data.posts.length} posts (Expected 20)`);
        console.log(`Total Posts in DB: ${resPagination.data.totalPosts}`);

        // 3. Test Search (e.g., "VR")
        console.log('\nTesting Search ("VR")...');
        const resSearch = await request('http://localhost:5001/api/blog/admin?search=VR', { headers });
        console.log(`Found ${resSearch.data.posts.length} posts matching "VR"`);
        const vrTitles = resSearch.data.posts.map(p => p.title);
        console.log('Titles:', vrTitles);

        // 4. Test Status Filter (Published)
        console.log('\nTesting Status Filter (Published)...');
        const resPublished = await request('http://localhost:5001/api/blog/admin?status=published', { headers });
        const allPublished = resPublished.data.posts.every(p => p.published === true);
        console.log(`All returned posts are published: ${allPublished} (Count: ${resPublished.data.posts.length})`);

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

testAdminFilters();
