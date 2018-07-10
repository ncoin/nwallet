import { Environments, Schema } from './schema';

/** stage environment */
export const env: Environments = {
    name: 'stage',
    network: Schema.network,
    endpoint : {
        client : 'http://wallet-api-dev.ncoin.com:3000/api/',
        auth : 'https://api-stage.ncoin.com/',
    }
};
