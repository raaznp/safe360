const { validateFileContent } = require('../../middleware/upload');
const path = require('path');
const fs = require('fs');

const run = async () => {
    const filePath = path.join(__dirname, '../test_assets', 'test.txt');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'This is a valid text file.');
    }

    console.log(`Testing validation for: ${filePath}`);
    const isValid = await validateFileContent(filePath, 'file');
    console.log(`Validation Result: ${isValid}`);
};

run();
