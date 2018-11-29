import { env } from '../../../environments/environment';

function api(path: string) {
    return env.endpoint.uaa(path);
}

export const AuthApiPaths = {
    account: {},

    auth: {
        phone: () => api(`authentication/phone`),
        verifyPhone: () => api(`authentication/verify-phone`)
    },

    token: () => api(`oauth/token`)
};
