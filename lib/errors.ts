export class ApiError extends Error {
  public statusCode: number; // Property to hold the HTTP status code

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';

    this.statusCode = statusCode;

    // This is important for maintaining proper stack trace for ES6 classes
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}