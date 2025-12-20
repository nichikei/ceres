
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../config/database.js';

// Middleware đính kèm thông tin người dùng nếu có JWT token
// Không yêu cầu bắt buộc phải xác thực, chỉ đính kèm thông tin nếu token hợp lệ
export const attachUserIfPresent = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    // Token không hợp lệ hoặc hết hạn, tiếp tục mà không có thông tin người dùng
  }

  next();
};

// Middleware yêu cầu xác thỳc
// Trả về 401 nếu không có token hợp lệ (trừ khi bật chế độ guest)
export const requireAuth = async (req, res, next) => {
  let userId;

  // Thử lấy thông tin người dùng đã được đính kèm (từ middleware attachUserIfPresent)
  if (req.user?.id) {
    userId = req.user.id;
  } else {
    // Thử xác thực token trực tiếp
    const header = req.headers.authorization?.split(' ')[1];
    if (header) {
      try {
        const decoded = jwt.verify(header, config.jwt.accessSecret);
        userId = decoded.id;
      } catch (error) {
        // Token không hợp lệ
      }
    }
  }

  // Sử dụng chế độ guest nếu được bật
  if (!userId && config.allowGuestMode) {
    userId = config.defaultUserId;
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Xác minh người dùng tồn tại trong database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...req.user, ...user };
    return next();
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({ error: 'Internal server error during auth' });
  }
};

// Lấy user ID từ request hoặc sử dụng giá trị mặc định
export const getUserIdOrFallback = (req) => {
  return req.user?.id ||
         Number(req.query.userId || req.body?.userId) ||
         config.defaultUserId;
};

// Đảm bảo danh tính người dùng cho các thao tác ghi dữ liệu
export const ensureUserIdentity = (req, res) => {
  if (req.user?.id) {
    return req.user.id;
  }

  if (config.allowGuestMode) {
    return config.defaultUserId;
  }

  res.status(401).json({ error: 'Unauthorized' });
  return null;
};
