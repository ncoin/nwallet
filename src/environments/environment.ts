import { Environments, Schema } from './schema';

/** develop environment */
export const env: Environments = {
    name: 'dev',
    isTestNetwork: Schema.isTestNetwork,
};
