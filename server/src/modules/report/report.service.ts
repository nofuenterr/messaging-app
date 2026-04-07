import type {
  ReportRow,
  CreateReportParams,
  GetReportParams,
  GetUserReportsParams,
  UpdateReportStatusParams,
} from '../../types/report.types.js';
import { NotFoundError } from '../../utils/errors/customErrors.js';

import * as reportRepo from './report.repository.js';

export async function createReport({
  reporter_id,
  target_user_id,
  target_message_id,
  target_group_id,
  reason,
}: CreateReportParams): Promise<{ id: number }> {
  const reportId = await reportRepo.createReport({
    reporter_id,
    target_user_id,
    target_message_id,
    target_group_id,
    reason,
  });

  if (!reportId) {
    throw new Error('Report not created');
  }

  return reportId;
}

export async function getReports(): Promise<ReportRow[]> {
  return reportRepo.getReports();
}

export async function getUserReports({ user_id }: GetUserReportsParams): Promise<ReportRow[]> {
  return reportRepo.getUserReports({ user_id });
}

export async function getReport({ id }: GetReportParams): Promise<ReportRow> {
  const report = await reportRepo.getReport({ id });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  return report;
}

export async function reviewReport({ id }: UpdateReportStatusParams): Promise<void> {
  const isReportReviewed = await reportRepo.reviewReport({ id });

  if (!isReportReviewed) {
    throw new Error('Report not reviewed');
  }
}

export async function resolveReport({ id }: UpdateReportStatusParams): Promise<void> {
  const isReportResolved = await reportRepo.resolveReport({ id });

  if (!isReportResolved) {
    throw new Error('Report not resolved');
  }
}
