type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** test network */
    network: NetworkType;
}

export const Schema = {
    network: <NetworkType>'test',
    tokenPath: 'uaa/api/oauth/token',
};
