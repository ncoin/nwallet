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
        sendAssetFee: (userId: number, walletId: number) => api(`users/${userId}/wallets/${walletId}/send/fee`),
        collateralTransactions: (collateralId: number) => api(`collaterals/${collateralId}/transactions`)
    },

    post: {
        createWallet: () => api(`wallets`),
        sendAsset: (walletId: number) => api(`wallets/${walletId}/withdrawals`),
        createTrust: (walletId: number) => api(`wallets/${walletId}/trust`),
        collateralRepay: (collateralId: number) => api(`collaterals/${collateralId}/repay`),
        collateralLoan: (collateralId: number) => api(`collaterals/${collateralId}/loans`)
    },

    put: {
        configuraton: (userId: number) => api(`users/${userId}/cofiguration/push`),
        walletAlign: (userId: number) => api(`users/${userId}/wallets`),
        walletVisibility: (userId: number, walletId: number) => api(`wallets/${walletId}`),
        sendAssetXdr: (walletId: number) => api(`wallets/${walletId}/withdrawals`),
        executeTrust: (walletId: number) => api(`wallets/${walletId}/trust`),
        collateralRepayExecute: (collateralId: number) => api(`collaterals/${collateralId}/repay`)
    }
};
