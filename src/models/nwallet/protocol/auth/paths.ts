import { env } from '../../../../environments/environment';

function api(path: string) {
    return env.endpoint.uaa(path);
}

export const Paths = {
    account: {},

    auth: {
        phone: () => api(`authentication/phone`),
    },

    token: () => api(`oauth/token`)
};
