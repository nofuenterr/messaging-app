import type { Express } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
    user?: {
      id: number;
      created: Date;
      display_name: string;
      username: string;
      pronouns: string;
      bio: string;
      avatar_color: string;
      banner_url: string;
      avatar_url: string;
      deleted: string;
      user_role: string;
    };
  }
}
