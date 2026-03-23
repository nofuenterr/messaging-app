import { Router } from 'express';

import * as validationMiddleware from '../../middleware/validation.middleware.js';

import * as reportController from './report.controller.js';

const reportRouter = Router();

// "/reports"
reportRouter.get('/', reportController.getUserReports);
reportRouter.post('/', validationMiddleware.validateReport, reportController.createReport);
reportRouter.get('/:id', reportController.getReport);

export default reportRouter;
