type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** public network */
    network: NetworkType;
    endpoint: {
        client: string,
        auth: string,
        token: () => string,
    }
}

export const Schema = {
    network: <NetworkType>'public',
    tokenPath: 'uaa/api/oauth/token',
};
