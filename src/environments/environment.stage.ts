import { Environments, Constants } from './template';
import { Schema } from './schema';

/** stage environment */
export const env: Environments = {
    name: 'stage',
    network: Schema.network,
    endpoint: {
        client: 'http://api.stage.ncoin.com:8080/wallet/api/',
        auth: 'http://api.stage.ncoin.com:8080/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`,
    },
};
