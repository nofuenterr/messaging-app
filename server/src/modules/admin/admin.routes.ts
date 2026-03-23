import { Router } from 'express';

import * as authMiddleware from '../../middleware/auth.middleware.js';

import * as adminController from './admin.controller.js';

const adminRouter = Router();

// "/admin"
adminRouter.use(authMiddleware.isAdmin);

adminRouter.get('/reports', adminController.getReports);
adminRouter.get('/reports/:id', adminController.getReport);
adminRouter.patch('/reports/:id/review', adminController.reviewReport);
adminRouter.patch('/reports/:id/resolve', adminController.resolveReport);

adminRouter.get('/users', adminController.getUsers);
adminRouter.delete('/users/:id', adminController.deleteUser);

export default adminRouter;
