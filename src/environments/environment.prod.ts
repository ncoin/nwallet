import { Environments, Constants } from './template';
import { Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    network: Schema.network,
    endpoint: {
        client: 'http://api.pp.ncoin.com:8080/wallet/api/',
        auth: 'http://api.pp.ncoin.com:8080/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`,
    },
};
