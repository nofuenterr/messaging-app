import { Router } from 'express';

import * as validationMiddleware from '../../middleware/validation.middleware.js';

import * as reportController from './report.controller.js';

const reportRouter = Router();

// "/reports"
reportRouter.get('/me', reportController.getUserReports);
reportRouter.post('/me', validationMiddleware.validateReport, reportController.createReport);
reportRouter.get('/me/:id', reportController.getReport);

export default reportRouter;
