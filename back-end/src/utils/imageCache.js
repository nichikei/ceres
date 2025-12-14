// Image cache sử dụng memory (chỉ dùng cho testing)
// Trong production nên dùng cloud storage như S3, Cloudinary, v.v.

const imageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

/**
 * Lưu ảnh tạm thời vào memory
 * @param {string} base64Image - Ảnh được mã hóa base64
 * @param {string} imageId - ID định danh unique cho ảnh
 * @returns {string} - ID của ảnh đã lưu
 */
export function saveImageTemporarily(base64Image, imageId) {
  const cacheEntry = {
    data: base64Image,
    timestamp: Date.now(),
  };
  
  imageCache.set(imageId, cacheEntry);
  
  // Tự động xóa sau 5 phút
  setTimeout(() => {
    if (imageCache.has(imageId)) {
      imageCache.delete(imageId);
      console.log(`🗑️ Đã xóa ảnh ${imageId} khỏi cache`);
    }
  }, CACHE_TTL);
  
  return imageId;
}

/**
 * Lấy ảnh từ cache
 * @param {string} imageId - ID ảnh cần lấy
 * @returns {string|undefined} - Dữ liệu base64 hoặc undefined
 */
export function getImage(imageId) {
  const cacheEntry = imageCache.get(imageId);
  return cacheEntry ? cacheEntry.data : undefined;
}

/**
 * Kiểm tra ảnh có tồn tại trong cache không
 * @param {string} imageId - ID ảnh cần kiểm tra
 * @returns {boolean} - true nếu ảnh tồn tại
 */
export function hasImage(imageId) {
  return imageCache.has(imageId);
}

/**
 * Xóa ảnh khỏi cache
 * @param {string} imageId - ID ảnh cần xóa
 * @returns {boolean} - true nếu xóa thành công
 */
export function deleteImage(imageId) {
  return imageCache.delete(imageId);
}

/**
 * Xóa toàn bộ cache
 */
export function clearCache() {
  const size = imageCache.size;
  imageCache.clear();
  console.log(`🗑️ Đã xóa ${size} ảnh khỏi cache`);
}

/**
 * Lấy thống kê cache
 * @returns {Object} - Thông tin về cache hiện tại
 */
export function getCacheStats() {
  return {
    size: imageCache.size,
    ttl: CACHE_TTL,
  };
}
