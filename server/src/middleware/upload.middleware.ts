import type { NextFunction, Request, Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';

function imageFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Images only'));
  }
}

export const uploadProfileImages = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
}).fields([
  { name: 'avatar_url', maxCount: 1 },
  { name: 'banner_url', maxCount: 1 },
]);

export function validateProfileImageSizes(req: Request, res: Response, next: NextFunction) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const avatarFile = files?.['avatar_url']?.[0];

  if (avatarFile && avatarFile.size > 2 * 1024 * 1024) {
    return res.status(400).json({ message: 'Avatar must be under 2MB' });
  }

  next();
}

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadBanner = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});
