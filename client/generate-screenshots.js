import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5175'; // Ensure this matches your running dev server port
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

const PAGES = [
    // { name: 'Home', path: '/' },
    // { name: 'About', path: '/about' },
    // { name: 'Products', path: '/products' },
    // { name: 'Services', path: '/services' },
    // { name: 'Careers', path: '/careers' },
    // { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    // { name: 'PrivacyPolicy', path: '/privacy' },
    // { name: 'Application_VR_Developer', path: '/careers/apply/1' },
    // { name: 'BlogPost_VR_Safety', path: '/blog/vr-industrial-safety' }
];

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function generateScreenshots() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    console.log('Starting Screenshot generation...');
    console.log(`Connecting to ${BASE_URL}.`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    try {
        const page = await browser.newPage();
        // Set a real User Agent to avoid detection/blocking by Google Maps
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set a wide viewport to ensure desktop layout
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

        for (const { name, path } of PAGES) {
            console.log(`Capturing: ${name} (${path})...`);
            
            await page.goto(`${BASE_URL}${path}`, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // Special handling for Contact page maps
            if (name === 'Contact') {
                console.log('Special handling for Contact Maps...');
                try {
                    await page.waitForSelector('iframe');
                    // Scroll to maps specifically
                    await page.evaluate(async () => {
                        const mapsSection = document.querySelector('iframe');
                        if (mapsSection) {
                            mapsSection.scrollIntoView({ behavior: 'instant', block: 'center' });
                        }
                        // Force eager loading
                        document.querySelectorAll('iframe').forEach(iframe => {
                            iframe.removeAttribute('loading');
                            iframe.loading = 'eager';
                            // Force reload src to ensure it picks up eager
                            const src = iframe.src;
                            iframe.src = src;
                        });
                    });
                    console.log('Waiting 15 seconds for maps to render in viewport...');
                    await new Promise(resolve => setTimeout(resolve, 15000));
                } catch (e) {
                    console.error('Error handling maps:', e);
                }
            }

            // Perform auto-scroll to trigger lazy loading (images, maps)
            // First, force remove lazy loading attributes if possible
            await page.evaluate(() => {
                document.querySelectorAll('img').forEach(img => img.loading = 'eager');
                document.querySelectorAll('iframe').forEach(iframe => iframe.loading = 'eager');
            });

            console.log('Scrolling to trigger lazy loads...');
            await autoScroll(page);

            // Scroll back to top so navbar isn't weirdly placed if sticky logic exists, 
            // though we are setting it absolute next.
            await page.evaluate(() => window.scrollTo(0, 0));

            // Inject CSS to:
            // 1. Force all "fade-in" elements to be visible.
            // 2. Change fixed Navbar to absolute so it just sits at the top.
            await page.addStyleTag({
                content: `
                    * {
                        transition: none !important;
                        animation: none !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        transform: none !important;
                    }
                    nav {
                        position: absolute !important;
                    }
                `
            });

            // Wait significantly longer for content to fully render
            console.log('Final wait before capture...');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Verify images are loaded
            console.log('Verifying all images are loaded...');
            try {
                await page.waitForFunction(() => {
                    const images = Array.from(document.querySelectorAll('img'));
                    // Check if complete and has width, handling checking actual loading state
                    return images.every(img => img.complete && img.naturalWidth > 0);
                }, { timeout: 30000 });
            } catch (e) {
                console.warn('Warning: Some images might not have loaded correctly.', e);
            }

            await page.screenshot({
                path: `${OUTPUT_DIR}/${name}.png`,
                fullPage: true,
                type: 'png'
            });

            console.log(`Saved ${name}.png`);
        }

        console.log('All screenshots saved in the /screenshots folder!');

    } catch (error) {
        console.error('Error generating screenshots:', error);
    } finally {
        await browser.close();
    }
}

generateScreenshots();
