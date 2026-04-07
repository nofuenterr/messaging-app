import type { Express } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
    user: {
      id: number;
      created: Date;
      display_name: string | null;
      username: string;
      pronouns: string | null;
      bio: string | null;
      avatar_color: string;
      avatar_url: string | null;
      banner_url: string | null;
      deleted: Date | null;
      user_role: 'admin' | 'user';
    };
  }
}
