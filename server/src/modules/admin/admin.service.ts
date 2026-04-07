import type {
  ReportRow,
  GetReportParams,
  UpdateReportStatusParams,
} from '../../types/report.types.js';
import type { SafeUser } from '../../types/user.types.js';
import * as reportService from '../report/report.service.js';
import * as userService from '../user/user.service.js';

export async function getReports(): Promise<ReportRow[]> {
  return reportService.getReports();
}

export async function getReport({ id }: GetReportParams): Promise<ReportRow> {
  return reportService.getReport({ id });
}

export async function reviewReport({ id }: UpdateReportStatusParams): Promise<void> {
  await reportService.reviewReport({ id });
}

export async function resolveReport({ id }: UpdateReportStatusParams): Promise<void> {
  await reportService.resolveReport({ id });
}

export async function getUsers(): Promise<SafeUser[]> {
  return userService.getUsers();
}

export async function deleteUser({ id }: { id: number }): Promise<void> {
  return userService.deleteUser({ id });
}
