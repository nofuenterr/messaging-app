import { NextFunction, Response } from 'express';
import passport from 'passport';

import { ControllerRequest } from '../types/controllers.type.js';
import { SafeUser } from '../types/user.types.js';

export const requireAuth = (req: ControllerRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: SafeUser | false) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' }); // redirect to '/auth/login' if not authenticated
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const isAdmin = (req: ControllerRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: not logged in' }); // redirect to '/auth/login' if not authenticated
  }

  if (user.user_role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only' });
  }

  next();
};
