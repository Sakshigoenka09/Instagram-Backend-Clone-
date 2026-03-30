const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'instagram_clone',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'gif'],
    },
});

const upload = multer({ storage: storage });
module.exports = upload;