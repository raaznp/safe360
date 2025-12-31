const http = require('http');

function request(url, options = {}, bodyString = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const params = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        if (bodyString) {
             params.headers['Content-Type'] = 'application/json';
             params.headers['Content-Length'] = Buffer.byteLength(bodyString);
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
        if (bodyString) req.write(bodyString);
        req.end();
    });
}

const run = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await request('http://localhost:5001/api/auth/login', { method: 'POST' }, JSON.stringify({ username: 'admin', password: 'password123' }));
        const token = loginRes.data.token;
        if (!token) throw new Error('Login failed: ' + JSON.stringify(loginRes.data));
        
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Create Category
        console.log('\n[1] Creating Category "TestCat"...');
        const catRes = await request('http://localhost:5001/api/categories', { headers, method: 'POST' }, JSON.stringify({ name: 'TestCat', slug: 'test-cat-' + Date.now() }));
        console.log(`Status: ${catRes.status}`);
        if (catRes.status !== 201) throw new Error('Cat Failed: ' + JSON.stringify(catRes.data));
        const categoryName = catRes.data.name; 
        const categoryId = catRes.data._id;
        console.log('Created Category:', categoryName);

        // 2. Create Tag
        console.log('\n[2] Creating Tag "TestTag"...');
        const tagRes = await request('http://localhost:5001/api/tags', { headers, method: 'POST' }, JSON.stringify({ name: 'TestTag', slug: 'test-tag-' + Date.now() }));
        console.log(`Status: ${tagRes.status}`);
        if (tagRes.status !== 201) throw new Error('Tag Failed: ' + JSON.stringify(tagRes.data));
        const tagName = tagRes.data.name;
        const tagId = tagRes.data._id;
        console.log('Created Tag:', tagName);

        // 3. Create Post with Category and Tag
        console.log('\n[3] Creating Post with Category and Tag...');
        const postData = {
            title: 'Refactor Test ' + Date.now(),
            slug: 'refactor-test-' + Date.now(),
            content: 'Testing category and tag integration.',
            category: categoryName, // Sending name as per schema update
            tags: [tagName, 'AnotherTag'],
            published: true
        };
        const createRes = await request('http://localhost:5001/api/blog', { headers, method: 'POST' }, JSON.stringify(postData));
        console.log(`Status: ${createRes.status}`);
        if (createRes.status !== 201) throw new Error('Create Post Failed: ' + JSON.stringify(createRes.data));
        const post = createRes.data;
        console.log('Post Created:', post._id);
        console.log('Post Category:', post.category);
        console.log('Post Tags:', post.tags);

        if (post.category !== categoryName) console.error('ERROR: Category mismatch!');
        if (!post.tags.includes(tagName)) console.error('ERROR: Tag missing!');

        // 4. Cleanup
        console.log('\n[4] Cleanup...');
        await request(`http://localhost:5001/api/blog/${post._id}`, { headers, method: 'DELETE' });
        await request(`http://localhost:5001/api/categories/${categoryId}`, { headers, method: 'DELETE' });
        await request(`http://localhost:5001/api/tags/${tagId}`, { headers, method: 'DELETE' });
        console.log('Cleanup Done.');

    } catch (e) {
        console.error('Error:', e);
    }
};

run();
