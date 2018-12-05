import { env } from '../../../environments/environment';

function api(path: string) {
    return env.endpoint.api(path);
}

export const WalletApiPaths = {
    get: {
        currency: () => api('currencies/'),
        wallets: (userId: number) => api(`users/${userId}/wallets`),
        walletDetail: (userId: number, userWalletId: number) => api(`wallets/${userWalletId}`),
        walletTransactions: (userId: number, userWalletId: number) => api(`wallets/${userWalletId}/transactions`),
        // transactionDetail: (userWalletId: number) => api(`wallets/${userWalletId}/transactions`),
        availableWallets: (userId: number) => api(`users/${userId}/wallets/available`),
        ticker: () => api(`tickers`),
        sendAssetFee: (userId: number, userWalletId: number) => api(`users/${userId}/wallets/${userWalletId}/send/fee`)
    },

    post: {
        createWallet: () => api(`wallets`),
        sendAsset: (userWalletId: number) => api(`wallets/${userWalletId}/withdrawals`),
        createTrust: (userWalletId: number) => api(`wallets/${userWalletId}/trust`)
    },

    put: {
        configuraton: (userId: number) => api(`users/${userId}/cofiguration/push`),
        walletAlign: (userId: number) => api(`users/${userId}/wallets`),
        walletVisibility: (userId: number, userWalletId: number) => api(`wallets/${userWalletId}`),
        sendAssetXdr: (userWalletId: number) => api(`wallets/${userWalletId}/withdrawals`),
        executeTrust: (userWalletId: number) => api(`wallets/${userWalletId}/trust`)
    }
};
