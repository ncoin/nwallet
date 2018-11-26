export interface HttpError {
    message: string; // 'error.userexists';
    status: number; // 400;
}
export interface HttpApiError extends HttpError {}
export interface HttpAuthError extends HttpError {
    entityName: string; // 'userManagement';
    errorKey: string; // 'userexists';
    params: string; // 'userManagement';
    title: string; // 'Login already in use';
    type: string; // 'http://www.jhipster.tech/problem/login-already-used';
}
