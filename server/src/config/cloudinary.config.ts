// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ["jpg", "jpeg", "png"],
    folder: "project-management-tool", // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

//                     storage: storage
module.exports = multer({ storage });
