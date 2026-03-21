export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
}

export interface ResponseHandlerParams {
  status?: number;
  message?: string;
  data?: unknown;
}
