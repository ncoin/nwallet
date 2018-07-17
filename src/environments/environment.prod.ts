import { Environments, Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    network: Schema.network,
    endpoint: {
        client: 'http://wallet-api.dev.ncoin.com:3000/api/',
        auth: 'https://api.ncoin.com/',
        token: () => `${env.endpoint.auth}${Schema.tokenPath}`,
    },
};
