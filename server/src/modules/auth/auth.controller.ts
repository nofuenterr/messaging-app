import { hash } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../config/env.js';
import { buildErrorObject } from '../../middleware/error.middleware.js';
import { ControllerRequest } from '../../types/controllers.type.js';

import * as authService from './auth.service.js';

export const authenticateLogin =
  (passport) => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (info) console.log(info.message);

      if (!user) {
        return res.status(401).json({ message: 'Auth Failed' }); // redirect to '/auth/login'
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // send token (cookie or response)
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // true in production with https or if using HTTPS
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Auth Passed', token, user }); // redirect to '/'
    })(req, res, next);
  };

export async function validateSignup(
  req: ControllerRequest<
    object,
    {
      username: string;
      password: string;
      avatar_color: string;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorObj = buildErrorObject(errors);

      return res.status(400).json({
        values: req.body,
        errors: errorObj,
      });
    }

    const { username, password, avatar_color } = matchedData(req);

    const hashedPassword = await hash(password, 10);

    const user = await authService.createUser({
      username,
      password_hash: hashedPassword,
      avatar_color,
    });
    res.status(201).json(user); // redirect to '/auth/login'
  } catch (err) {
    if (err.code === '23505' && err.constraint === 'users_username_key') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    next(err);
  }
}

export async function logoutUser(req: ControllerRequest, res: Response) {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out' });
}
