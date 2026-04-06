import type { Result, ValidationError } from 'express-validator';

export function buildErrorObject(errors: Result<ValidationError>) {
  const errorObj: Record<string, string> = {};

  errors.array().forEach((err) => {
    if ('path' in err) {
      errorObj[err.path] = err.msg;
    }
  });

  return errorObj;
}
