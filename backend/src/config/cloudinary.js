// Cấu hình Cloudinary cho lưu trữ ảnh
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload ảnh lên Cloudinary
 * @param {Buffer} buffer - File buffer từ multer
 * @param {String} folder - Thư mục trên Cloudinary
 * @returns {Promise} Upload result
 */
export const uploadImage = (buffer, folder = 'pawcare') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Xoá ảnh từ Cloudinary
 * @param {String} url - URL của ảnh trên Cloudinary
 * @returns {Promise}
 */
export const deleteImage = async (url) => {
  try {
    // Extract public_id từ URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const publicId = lastPart.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
