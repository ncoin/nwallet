type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** public network */
    network: NetworkType;
}

export const Schema = {
    network : <NetworkType> 'public'
}
