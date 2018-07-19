import { Environments, Schema } from './schema';

/** develop environment */
export const env: Environments = {
    name: 'dev',
    network: Schema.network,
    endpoint: {
        client: 'http://api.dev.ncoin.com:8080/wallet/api/',
        auth: 'http://api.dev.ncoin.com:8080/',
        token: () => `${env.endpoint.auth}${Schema.tokenPath}`,
    },
};

