import { Response, NextFunction } from 'express';

import { ControllerRequest } from '../../types/controllers.type.js';

import * as adminService from './admin.service.js';

export async function getReports(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reports = await adminService.getReports();
    res.status(200).json(reports);
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
    const report = await adminService.getReport({ id: Number(req.params.id) });
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function reviewReport(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await adminService.reviewReport({ id: Number(req.params.id) });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function resolveReport(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await adminService.resolveReport({ id: Number(req.params.id) });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getUsers(
  req: ControllerRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await adminService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: ControllerRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await adminService.deleteUser({ id: Number(req.params.id) });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
