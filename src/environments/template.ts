type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** test network */
    network: NetworkType;
    endpoint: {
        client: string,
        auth: string,
        api: (path: string) => string;
        token: () => string,
        stream: string,
    };
}

export interface Schema {
    /**
     * public | test
     */
    network: NetworkType;
}

export const Constants = {
    tokenPath : 'uaa/api/oauth/token',
    supportedLanuages : ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh-cn', 'zh-tw'],
};

