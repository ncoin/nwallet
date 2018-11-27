import { Environments, Constants } from './template';

import { Schema } from './schema';

/** develop environment */
export const env: Environments = {
    name: 'dev',
    network: Schema.network,
    endpoint: {
        stream: (type: 'ticker' | 'wallet', token: string) => `http://api.dev.ncoin.com:4001/streams/${type}?token=${token}`,
        uaa: (path: string) => `http://api.dev.ncoin.com:8080/uaa/api/${path}`,
        api: (path: string) => `http://api.dev.ncoin.com:8080/wallet/v1/${path}`,
    },
};
