import { Environments, Constants } from './template';
import { Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    network: Schema.network,
    endpoint: {
        client: 'http://api.ncoin.com:8080/wallet/api/',
        stream : 'http://wallet-api.ncoin.com:3000/explorer/',
        auth: 'http://api.ncoin.com:8080/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`,
    },
};
