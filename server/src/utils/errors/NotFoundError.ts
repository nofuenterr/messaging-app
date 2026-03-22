class CustomNotFoundError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

export default CustomNotFoundError;
