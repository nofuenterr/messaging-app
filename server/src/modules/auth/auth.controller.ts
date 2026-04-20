import { hash } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import jwt from 'jsonwebtoken';
import type { PassportStatic } from 'passport';

import { JWT_SECRET, NODE_ENV } from '../../config/env.js';
import { buildErrorObject } from '../../middleware/error.middleware.js';
import { ControllerRequest } from '../../types/controllers.type.js';
import type { SafeUser } from '../../types/user.types.js';

import * as authService from './auth.service.js';

export const authenticateLogin =
  (passport: PassportStatic) =>
  (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      'local',
      { session: false },
      (err: Error | null, user: SafeUser | false, info: { message: string } | undefined) => {
        if (err) return next(err);

        if (info) console.log(info.message);

        if (!user) {
          return res.status(401).json({ message: info?.message || 'Authentication failed' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: 1000 * 60 * 60,
        });

        return res.status(200).json({ message: 'Auth Passed', token, user });
      }
    )(req, res, next);
  };

export async function validateSignup(
  req: ControllerRequest<object, { username: string; password: string; avatar_color: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
      return;
    }

    const { username, password, avatar_color } = matchedData(req);

    const password_hash = await hash(password, 10);

    const user = await authService.createUser({ username, password_hash, avatar_color });
    res.status(201).json(user);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      'constraint' in err &&
      (err as { code: string; constraint: string }).code === '23505' &&
      (err as { code: string; constraint: string }).constraint === 'users_username_key'
    ) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }
    next(err);
  }
}

export async function logoutUser(req: ControllerRequest, res: Response): Promise<void> {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
}
