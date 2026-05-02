import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'workhive_attachments',
    resource_type: 'auto', // allows all file types, or use 'image', 'video', 'raw'
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'csv'],
  },
});

const upload = multer({ storage });

export default upload;
