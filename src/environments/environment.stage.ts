import { Environments, Constants } from './template';
import { Schema } from './schema';

/** stage environment */
export const env: Environments = {
    name: 'stage',
    network: Schema.network,
    endpoint: {
        stream: (type: 'ticker' | 'wallet', token: string) => `http://api.stage.ncoin.com:4001/streams/${type}?token=${token}`,
        uaa: (path: string) => `http://api.stage.ncoin.com:8080/uaa/api/${path}`,
        api: (path: string) => `https://api.stage.ncoin.com/wallet/api/${path}`,
    }
};
