import { Response, NextFunction } from 'express';

import { ControllerRequest } from '../../types/controllers.type.js';

import * as adminService from './admin.service.js';

export async function getReports(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const reports = await adminService.getReports();
    res.status(200).json(reports);
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
    const report = await adminService.getReport({ id: req.params.id });
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function reviewReport(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await adminService.reviewReport({ id: req.params.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function resolveReport(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    await adminService.resolveReport({ id: req.params.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: ControllerRequest, res: Response, next: NextFunction) {
  try {
    const users = await adminService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: ControllerRequest<{ id: number }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = await adminService.deleteUser({ id: req.params.id });
    res.status(200).json(userId);
  } catch (err) {
    next(err);
  }
}
