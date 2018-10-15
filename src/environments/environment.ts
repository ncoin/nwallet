import { Environments, Constants } from './template';

import { Schema } from './schema';

/** develop environment */
export const env: Environments = {
    name: 'dev',
    network: Schema.network,
    endpoint: {
        client: 'http://api.dev.ncoin.com:8080/wallet/api/',
        stream : 'http://wallet-api.dev.ncoin.com:3000/explorer/',
        auth: 'http://api.dev.ncoin.com:8080/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`,
    },
};
