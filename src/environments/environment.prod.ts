import { Environments, Schema } from './schema';

/** product environment */
export const env: Environments = {
    name: 'prod',
    isTestNetwork: Schema.isTestNetwork,
};
