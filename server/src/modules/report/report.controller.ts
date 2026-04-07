import { Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { buildErrorObject } from '../../middleware/error.middleware.js';
import { ControllerRequest } from '../../types/controllers.type.js';

import * as reportService from './report.service.js';

export async function getUserReports(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userReports = await reportService.getUserReports({ user_id: req.user.id });
    res.status(200).json(userReports);
  } catch (err) {
    next(err);
  }
}

export async function createReport(
  req: ControllerRequest<
    object,
    {
      target_user_id?: number;
      target_message_id?: number;
      target_group_id?: number;
      reason: string;
    }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ values: req.body, errors: buildErrorObject(errors) });
      return;
    }

    const { reason } = matchedData(req);

    const reportId = await reportService.createReport({
      reporter_id: req.user.id,
      target_user_id: req.body.target_user_id,
      target_message_id: req.body.target_message_id,
      target_group_id: req.body.target_group_id,
      reason,
    });

    res.status(201).json(reportId);
  } catch (err) {
    next(err);
  }
}

export async function getReport(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const report = await reportService.getReport({ id: Number(req.params.id) });
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}
