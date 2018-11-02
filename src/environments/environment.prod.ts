import { Environments, Constants } from './template';
import { Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    network: Schema.network,
    endpoint: {
        stream: (type: 'ticker' | 'wallet', token: string) => `http://api.ncoin.com:4001/streams/${type}?token=${token}`,
        uaa: (path: string) => `http://api.ncoin.com:8080/uaa/api/${path}`,
        api: (path: string) => `http://api.ncoin.com:8080/wallet/api/${path}`,
    }
};
