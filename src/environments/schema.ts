type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** test network */
    network: NetworkType;
    endpoint: {
        client: string,
        auth: string,
        token: () => string,
    }
}

export const Schema = {
    network: <NetworkType>'test',
    tokenPath: 'uaa/api/oauth/token',
};
