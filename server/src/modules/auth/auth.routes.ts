import { Router } from 'express';
import type { PassportStatic } from 'passport';
import type { Pool } from 'pg';

import * as validationMiddleware from '../../middleware/validation.middleware.js';

import * as authController from './auth.controller.js';

// "/auth"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (passport: PassportStatic, pool: Pool) => {
  const authRouter = Router();

  authRouter.post('/login', authController.authenticateLogin(passport));
  authRouter.post('/signup', validationMiddleware.validateUser, authController.validateSignup);
  authRouter.get('/logout', authController.logoutUser);

  return authRouter;
};
