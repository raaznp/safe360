const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const FileType = require('file-type');

// Allowed Configuration
const ALLOWED_MEDIA = {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'mp4', 'webm', 'mov', 'mp3', 'wav', 'aac', 'm4a', 'ogg'],
    mimeTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/quicktime',
        'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/x-m4a', 'audio/ogg'
    ]
};

const ALLOWED_FILES = {
    extensions: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'odt', 'ods', 'odp', 'zip', 'rar'],
    mimeTypes: [
        'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/rtf',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.presentation',
        'application/zip', 'application/x-rar-compressed'
    ]
};

// Storage Configuration
/**
 * Creates a Multer uploader with extension filtering and type-based path
 * @param {string} type - 'media' or 'files' (or 'file')
 */
const createUploader = (type) => {
    // Determine subdirectory based on type
    // If type is 'media', use 'media'. If 'file', use 'files' (as requested)
    const subDir = type === 'media' ? 'media' : 'files';
    const allowed = type === 'media' ? ALLOWED_MEDIA : ALLOWED_FILES;
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dir = `uploads/${subDir}/${year}/${month}/${day}/`;
            
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            const randomName = crypto.randomBytes(16).toString('hex');
            cb(null, randomName + path.extname(file.originalname));
        }
    });
    
    return multer({ 
        storage: storage,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
        fileFilter: function (req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase().substring(1);
            if (allowed.extensions.includes(ext)) {
                return cb(null, true);
            }
            cb(new Error(`Invalid file type. Allowed: ${allowed.extensions.join(', ')}`));
        }
    });
};

/**
 * Validates the file content using magic numbers
 * @param {string} filePath - Path to the uploaded file
 * @param {string} type - 'media' or 'file'
 * @returns {Promise<boolean>}
 */
const validateFileContent = async (filePath, type) => {
    try {
        const allowed = type === 'media' ? ALLOWED_MEDIA : ALLOWED_FILES;
        const fileTypeResult = await FileType.fromFile(filePath);
        const ext = path.extname(filePath).toLowerCase().substring(1);

        console.log(`Validating ${path.basename(filePath)} (${type}). Detected:`, fileTypeResult);

        if (!fileTypeResult) {
            // No magic number found. 
            // Only allow specific text-based formats that don't have magic numbers.
            const textExtensions = ['txt', 'csv', 'svg', 'rtf', 'html', 'xml', 'json'];
            
            if (textExtensions.includes(ext) && allowed.extensions.includes(ext)) {
                return true;
            }
            
            // Reject everything else (including jpg/png without magic numbers)
            console.log(`Rejected ${ext} file due to missing magic number.`);
            return false;
        }

        // Check if detected MIME/Ext matches our allowed list
        // Note: fileTypeResult.ext might differ (e.g. 'xml' for 'svg')
        
        // Strict check: Detected extension must be in our allowed list OR 
        // Detected MIME must be in our allowed MIME list
        
        const isAllowedExt = allowed.extensions.includes(fileTypeResult.ext);
        const isAllowedMime = allowed.mimeTypes.includes(fileTypeResult.mime);

        if (isAllowedExt || isAllowedMime) {
             return true;
        }

        console.log(`Rejected: Detected type ${fileTypeResult.ext} / ${fileTypeResult.mime} not in allowed list.`);
        return false;

    } catch (error) {
        console.error('Validation Error:', error);
        return false;
    }
};

module.exports = { createUploader, validateFileContent, ALLOWED_MEDIA, ALLOWED_FILES };
