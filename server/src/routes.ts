import { Router } from 'express';

import pool from './config/database.js';
import configurePassport from './config/passport.js';
import { requireAuth } from './middleware/auth.middleware.js';
import adminRouter from './modules/admin/admin.routes.js';
import authRouterFactory from './modules/auth/auth.routes.js';
import groupRouter from './modules/group/group.routes.js';
import homeRouter from './modules/home/home.routes.js';
import profileRouter from './modules/profile/profile.routes.js';
import reportRouter from './modules/report/report.routes.js';

const passport = configurePassport(pool);
const authRoutes = authRouterFactory(passport, pool);
const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', requireAuth, adminRouter);
router.use('/groups', requireAuth, groupRouter);
router.use('/reports', requireAuth, reportRouter);
router.use('/users', requireAuth, profileRouter);
router.use('/', requireAuth, homeRouter);

router.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default router;
