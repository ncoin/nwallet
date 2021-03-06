import { Environments, Constants } from './template';
import { Schema } from './schema';

/** stage environment */
export const env: Environments = {
    name: 'stage',
    network: Schema.network,
    endpoint: {
        client: 'https://api.stage.ncoin.com/wallet/api/',
        auth: 'https://api.stage.ncoin.com/',
        api: (path: string) => `${env.endpoint.client}${path}`,
        token: () => `${env.endpoint.auth}${Constants.tokenPath}`,
    },
};
