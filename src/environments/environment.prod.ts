import { Environments, Constants } from './template';
import { Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    network: Schema.network,
    endpoint: {
        client: 'http://api.ncoin.com:8080/wallet/api/',
        stream: (type: 'ticker' | 'wallet', token: string) => `http://api.ncoin.com:4001/streams/${type}?token=${token}`,
        auth: 'http://api.ncoin.com:8080/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`
    }
};
