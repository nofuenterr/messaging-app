import { Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { buildErrorObject } from '../../middleware/error.middleware.js';
import { ControllerRequest } from '../../types/controllers.type.js';

import * as reportService from './report.repository.js';

export async function getUserReports(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const userReports = await reportService.getUserReports({
      user_id: req.user.id,
    });
    res.status(200).json(userReports);
  } catch (err) {
    next(err);
  }
}

export async function createReport(
  req: ControllerRequest<
    object,
    {
      target_user_id: number;
      target_message_id: number;
      target_group_id: number;
      reason: string;
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

    const { reason } = matchedData(req);

    const reportId = await reportService.createReport({
      reporter_id: req.user.id,
      reason,
      ...req.body,
    });
    res.status(201).json(reportId);
  } catch (err) {
    next(err);
  }
}

export async function getReport(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const report = await reportService.getReport({
      id: req.params.id,
    });
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}
