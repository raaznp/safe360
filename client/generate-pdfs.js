import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5175'; // Updated to match running server port
const OUTPUT_DIR = path.join(__dirname, 'pdfs');

const PAGES = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'PrivacyPolicy', path: '/privacy' },
    // Dummy ID for Application
    { name: 'Application_VR_Developer', path: '/careers/apply/1' },
    // Dummy slug for Blog Post
    { name: 'BlogPost_VR_Safety', path: '/blog/vr-industrial-safety' }
];

async function generatePDFs() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    console.log('Starting PDF generation...');
    console.log(`Connecting to ${BASE_URL}. Make sure your dev server is running!`);

    const browser = await puppeteer.launch({
        headless: "new"
    });

    try {
        const page = await browser.newPage();

        for (const { name, path } of PAGES) {
            console.log(`Generating PDF for: ${name} (${path})...`);
            
            await page.goto(`${BASE_URL}${path}`, {
                waitUntil: 'networkidle0', // Wait until network is idle (images loaded etc)
                timeout: 60000
            });

            // Additional wait to ensure any heavy animations/images are fully settled
            // relying mainly on CSS media print, but this helps layout stability
            await new Promise(resolve => setTimeout(resolve, 2000));

            await page.pdf({
                path: `${OUTPUT_DIR}/${name}.pdf`,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px'
                }
            });

            console.log(`Saved ${name}.pdf`);
        }

        console.log('All PDFs generated successfully in the /pdfs folder!');

    } catch (error) {
        console.error('Error generating PDFs:', error);
    } finally {
        await browser.close();
    }
}

generatePDFs();
