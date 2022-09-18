export function LogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

export enum HttpError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
