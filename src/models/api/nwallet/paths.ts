import { env } from '../../../environments/environment';

function api(path: string) {
    return env.endpoint.api(path);
}

export const WalletApiPaths = {
    get: {
        currency: () => api('currencies/'),
        wallets: (userId: number) => api(`users/${userId}/wallets`),
        walletDetail: (userId: number, walletId: number) => api(`wallets/${walletId}`),
        walletTransactions: (userId: number, walletId: number) => api(`wallets/${walletId}/transactions`),
        // transactionDetail: (walletId: number) => api(`wallets/${walletId}/transactions`),
        availableWallets: (userId: number) => api(`users/${userId}/wallets/available`),
        ticker: () => api(`tickers`),
        collateralTransactions: (collateralId: number) => api(`collaterals/${collateralId}/transactions`),
        checkPush: (userId: number) => api(`users/${userId}/notification`),
    },

    post: {
        createWallet: () => api(`wallets`),
        sendAsset: (walletId: number) => api(`wallets/${walletId}/withdrawals`),
        createTrust: (walletId: number) => api(`wallets/${walletId}/trust`),
        collateralRepay: (collateralId: number) => api(`collaterals/${collateralId}/repay`),
        collateralLoan: (collateralId: number) => api(`collaterals/${collateralId}/loans`),
        buyNcn: (walletId: number) => api(`wallets/${walletId}/buy`),
        registerPush: (userId: number) => api(`users/${userId}/notification`),
    },

    put: {
        walletAlign: (userId: number) => api(`users/${userId}/wallets`),
        walletVisibility: (userId: number, walletId: number) => api(`wallets/${walletId}`),
        sendAssetXdr: (walletId: number) => api(`wallets/${walletId}/withdrawals`),
        executeTrust: (walletId: number) => api(`wallets/${walletId}/trust`),
        collateralRepayExecute: (collateralId: number) => api(`collaterals/${collateralId}/repay`),
        changePush: (userId: number) => api(`users/${userId}/notification`),
    }
};
