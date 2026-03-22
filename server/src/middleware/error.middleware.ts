export function buildErrorObject(errors) {
  const errorObj = {};

  errors.array().forEach((err) => {
    errorObj[err.path] = err.msg;
  });

  return errorObj;
}
