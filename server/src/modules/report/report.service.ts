import { NotFoundError } from '../../utils/errors/customErrors.js';

import * as reportRepo from './report.repository.js';

export async function createReport({
  reporter_id,
  target_user_id,
  target_message_id,
  target_group_id,
  reason,
}) {
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

export async function getReports() {
  return reportRepo.getReports();
}

export async function getUserReports({ user_id }) {
  return reportRepo.getUserReports({ user_id });
}

export async function getReport({ id }) {
  const report = await reportRepo.getReport({ id });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  return report;
}

export async function reviewReport({ id }) {
  const isReportReviewed = await reportRepo.reviewReport({ id });

  if (!isReportReviewed) {
    throw new Error('Report not reviewed');
  }
}

export async function resolveReport({ id }) {
  const isReportResolved = await reportRepo.resolveReport({ id });

  if (!isReportResolved) {
    throw new Error('Report not resolved');
  }
}
