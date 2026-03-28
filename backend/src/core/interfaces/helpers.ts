export interface ResponseHandlerParams<T = undefined> {
    status: number;
    message: string;
    data?: T;
    error?: { code: string };
}
