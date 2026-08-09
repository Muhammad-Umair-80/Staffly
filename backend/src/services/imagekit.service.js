const ImageKit = require('@imagekit/nodejs');
require('dotenv').config();
let imageKitInstance = null;

function getImageKitInstance() {
  if (imageKitInstance) {
    return imageKitInstance;
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error('ImageKit credentials are missing. Set IMAGEKIT_PUBLIC_KEY and IMAGEKIT_PRIVATE_KEY in your environment.');
  }

  imageKitInstance = new ImageKit({ publicKey, privateKey });
  return imageKitInstance;
}

async function uploadImage(imageBuffer, fileName) {
  const imageKit = getImageKitInstance();
  const resolvedFileName = fileName || `image_${Date.now()}.jpg`;

  const uploadResponse = await imageKit.files.upload({
    file: imageBuffer.toString('base64'),
    fileName: resolvedFileName,
    folder: '/images',
    useUniqueFileName: true,
  });

  return uploadResponse;
}

module.exports = { uploadImage };