type NetworkType = 'public' | 'test';
type EnvironmentType = 'dev' | 'stage' | 'prod';

export interface Environments {
    name: EnvironmentType;
    /** test network */
    network: NetworkType;
    endpoint: {
        api: (path: string) => string;
        uaa: (path: string) => string;
        stream: (type: 'ticker' | 'wallet', token: string) => string;
    };
}

export interface Schema {
    /**
     * public | test
     */
    network: NetworkType;
}

export const Constants = {
    supportedLanuages: ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh-cn', 'zh-tw']
};
