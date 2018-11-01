export const Paths = {
    get: {
        wallets: (userId: string) => `users/${userId}/wallets`,
        walletDetail: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}`,
        walletTransactions: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/transactions`,
        creationAvailableWallets: (userId: string) => `users/${userId}/wallets/available`,
        ticker: (userId: string) => `users/${userId}/tickers`,
        sendAssetFee: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/send/fee`
    },

    post: {
        createWallet: (userId: string) => `/users/${userId}/wallets`,
        sendAsset: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/send`
    },

    put: {
        configuraton: (userId: string) => `users/${userId}/cofiguration/push`,
        walletAlign: (userId: string) => `users/${userId}/wallets/align`,
        walletVisibility: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/visibility`
    }
};
