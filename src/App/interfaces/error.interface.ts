export interface IError {
    path: string;
    message: string;
}

export interface IErrorResponse {
    success: boolean;
    message: string;
    errorSource: IError[];
    error?: unknown;
    stack?: string;
    statusCode?: number;
}
