type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** test network */
    isTestNetwork: NetworkType;
}

export const Schema = {
    isTestNetwork : <NetworkType> 'test'
}
