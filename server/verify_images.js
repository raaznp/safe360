const fs = require('fs');
const https = require('https');

// Read seed.js to extract URLs
const seedContent = fs.readFileSync('seed.js', 'utf8');
const urlRegex = /'https:\/\/images\.unsplash\.com\/[^']+'/g;
const matches = seedContent.match(urlRegex);

if (!matches) {
    console.log('No URLs found');
    process.exit(0);
}

const urls = matches.map(m => m.replace(/'/g, ''));
console.log(`Found ${urls.length} URLs to check...`);

const checkUrl = (url) => {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            resolve({ url, status: res.statusCode });
        });
        
        req.on('error', () => {
             resolve({ url, status: 'ERROR' });
        });
        
        req.end();
    });
};

const checkAll = async () => {
    const results = [];
    // Check in batches of 5 to avoid rate limiting
    for (let i = 0; i < urls.length; i += 5) {
        const batch = urls.slice(i, i + 5);
        const batchResults = await Promise.all(batch.map(checkUrl));
        results.push(...batchResults);
        console.log(`Checked ${Math.min(i + 5, urls.length)}/${urls.length}`);
    }

    const failed = results.filter(r => r.status !== 200);
    if (failed.length > 0) {
        console.log('\nFAILED URLS:');
        failed.forEach(f => console.log(`${f.status}: ${f.url}`));
    } else {
        console.log('\nAll URLs are valid!');
    }
};

checkAll();
