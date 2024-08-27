export class ClientError extends Error {
  public code: number;

  public constructor(message: string, code: number = 400) {
    super();
    this.message = message;
    this.code = code;
  }
}
