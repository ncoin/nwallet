import { env } from '../../../environments/environment';

function api(path: string) {
    return env.endpoint.api(path);
}

export const WalletApiPaths = {
    get: {
        currency: () => api('currencies/'),
        wallets: (userId: string) => api(`users/${userId}/wallets`),
        walletDetail: (userId: string, userWalletId: number) => api(`wallets/${userWalletId}`),
        walletTransactions: (userId: string, userWalletId: number) => api(`wallets/${userWalletId}/transactions`),
        // transactionDetail: (userWalletId: number) => api(`wallets/${userWalletId}/transactions`),
        creationAvailableWallets: (userId: string) => api(`users/${userId}/wallets/available`),
        ticker: () => api(`tickers`),
        sendAssetFee: (userId: string, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/send/fee`)
    },

    post: {
        createWallet: (userId: string) => api(`wallets`),
        sendAsset: (userWalletId: number) => api(`wallets/${userWalletId}/withdrawals`)
    },

    put: {
        configuraton: (userId: string) => api(`users/${userId}/cofiguration/push`),
        walletAlign: (userId: string) => api(`users/${userId}/wallets`),
        walletVisibility: (userId: string, userWalletId: number) => api(`wallets/${userWalletId}`),
        sendAssetXdr: (userWalletId: number) => api(`wallets/${userWalletId}/withdrawals`)
    }
};
