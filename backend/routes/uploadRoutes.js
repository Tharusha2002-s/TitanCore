import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Filter to accept PDF, DOC, DOCX, and common Image formats
const checkFileType = (file, cb) => {
    const filetypes = /pdf|doc|docx|jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, Word Documents (.doc, .docx), and Images (.jpg, .jpeg, .png, .webp) are allowed!'));
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper stream uploader to Cloudinary
const uploadToCloudinary = (fileBuffer, fieldName, originalName) => {
    return new Promise((resolve, reject) => {
        const ext = path.extname(originalName).toLowerCase();
        const isPdf = ext === '.pdf' || ext === '.doc' || ext === '.docx';
        const folder = fieldName === 'cv' ? 'titancore/cvs' : 'titancore/uploads';
        
        // Append the file extension to the public_id for raw resource types so the extension is preserved in the URL
        const publicId = `${fieldName}-${Date.now()}-${Math.round(Math.random() * 1E9)}${isPdf ? ext : ''}`;

        const options = {
            folder,
            resource_type: isPdf ? 'raw' : 'image',
            public_id: publicId
        };

        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });

        Readable.from(fileBuffer).pipe(stream);
    });
};

router.post('/', (req, res) => {
    upload.any()(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Please select a file to upload' });
        }

        try {
            // Upload all files to Cloudinary in parallel
            const uploadPromises = req.files.map(file => 
                uploadToCloudinary(file.buffer, file.fieldname, file.originalname)
            );

            const results = await Promise.all(uploadPromises);

            // Return secure Cloudinary URLs
            if (results.length === 1) {
                res.json({
                    success: true,
                    filePath: results[0].secure_url
                });
            } else {
                res.json({
                    success: true,
                    filePaths: results.map(r => r.secure_url)
                });
            }
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            res.status(500).json({ success: false, message: `Cloudinary Upload Error: ${uploadError.message}` });
        }
    });
});

export default router;
