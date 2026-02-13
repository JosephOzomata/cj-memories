import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

// Create upload preset in your Cloudinary dashboard first
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'cjmemories';
const API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
const API_SECRET = process.env.REACT_APP_CLOUDINARY_API_SECRET;

export { cloudinary, UPLOAD_PRESET, API_KEY, API_SECRET };