import { validationResult } from 'express-validator';

// Middleware kiểm tra validate request sử dụng express-validator
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }

  next();
};