import * as reportService from '../report/report.service.js';
import * as userService from '../user/user.service.js';

export async function getReports() {
  return reportService.getReports();
}

export async function getReport({ id }) {
  return reportService.getReport({ id });
}

export async function reviewReport({ id }) {
  await reportService.reviewReport({ id });
}

export async function resolveReport({ id }) {
  await reportService.resolveReport({ id });
}

export async function getUsers() {
  return userService.getUsers();
}

export async function deleteUser({ id }) {
  return userService.deleteUser({ id });
}
