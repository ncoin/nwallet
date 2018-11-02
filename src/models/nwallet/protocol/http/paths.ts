import { env } from '../../../../environments/environment';

function api(path: string) {
    return env.endpoint.api(path);
}

export const Paths = {
    get: {
        wallets: (userId: string) => api(`users/${userId}/wallets`),
        walletDetail: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}`),
        walletTransactions: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/transactions`),
        creationAvailableWallets: (userId: string) => api(`users/${userId}/wallets/available`),
        ticker: (userId: string) => api(`users/${userId}/tickers`),
        sendAssetFee: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/send/fee`)
    },

    post: {
        createWallet: (userId: string) => api(`/users/${userId}/wallets`),
        sendAsset: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/send`)
    },

    put: {
        configuraton: (userId: string) => api(`users/${userId}/cofiguration/push`),
        walletAlign: (userId: string) => api(`users/${userId}/wallets/align`),
        walletVisibility: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/visibility`)
    }
};
