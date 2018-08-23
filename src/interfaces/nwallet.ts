import { Asset } from 'stellar-sdk';

export namespace NWallet {

}

export namespace NWallet {
    export interface Account {
        isActivate: boolean;
        signature: Signature;
        address: Address;
        profile: Profile;
        wallets: AssetContext[];
    }

    export interface Address {
        location: string;
    }

    export interface Profile {
        firstName: string;
        middleName?: string;
        lastName: string;
        phoneNumber: { countryCode: string; number: string };
    }

    export interface Signature {
        public: string;
        secret: string;
    }

    export interface AssetItem {
        asset: Asset;
        isNative: boolean;
        /** amount per usd price */
        price: number;
    }

    export interface AssetContext {
        item: AssetItem;
        amount: string;
    }

    // todo move to other namespace

    export const Assets = {
        NCH: <Asset>undefined,
        NCN: <Asset>undefined,
        XLM: Asset.native(),
    };
}

export namespace NWallet.Transactions {
    export interface Context {
        pageToken: string;
        records: NWallet.Transactions.Record[];
        hasNext: boolean;
    }

    export interface Record {
        type: string;
        context: AssetContext;
        date: Date;
        id: string;
    }

    export function parseRecords(asset: Asset, data: Object[]): Record[] {
        const rawRecords = data;
        return rawRecords
            .map<Record>(raw => {
                const resAsset = raw['asset'];
                const item = getOrAddWalletItem(resAsset['code'], resAsset['issuer'], raw['native']);
                const amount = raw['amount'];
                const createdAt = raw['created_at'];
                return <Record>{
                    type: raw['type'],
                    context: <AssetContext>{
                        item: item,
                        amount: amount,
                    },
                    date: createdAt,
                    id: raw['transaction_hash'],
                };
            })
            .filter(record => {
                // todo extract --sky
                if (asset.isNative() && record.context.item.asset.isNative()) {
                    return true;
                } else {
                    return (
                        asset.getCode() === record.context.item.asset.getCode() &&
                        asset.getIssuer() === record.context.item.asset.getIssuer() &&
                        asset.getAssetType() === record.context.item.asset.getAssetType()
                    );
                }
            });
    }
}

const AssetMap = new Map<string, NWallet.AssetItem>([
    [
        'XLM_native',
        <NWallet.AssetItem>{
            asset: Asset.native(),
            price: 0,
            isNative: true,
        },
    ],
]);

export namespace NWallet.Protocol {
    export enum XdrRequestTypes {
        Trust = 'trusts/stellar/',
        Buy = 'buys/ncash/stellar/',
        Loan = 'loans/ncash/stellar/',
    }

    export enum Types {
        Transfer = 'transactions/stellar/accounts/',
        LoanStatus = 'loans/ncash/stellar/',
        LoanDetail = 'loans/ncash/stellar/',
        Collateral = 'loans/ncash/collateral'
    }

    export interface RequestBase {
        [param: string]: string | string[];
    }

    // tslint:disable-next-line:no-empty-interface
    export interface Response {}

    export interface XDRResponse extends Response {
        id: string;
        xdr: string;
    }

    export interface TransactionRequest extends RequestBase {
        asset_issuer?: string;
        asset_code?: string;
        limit?: string;
        skip?: string;
        order?: string;
    }

    export interface TransactionResponse extends Response {
        transactions: Transaction[];
    }

    export interface LoanStatusResponse extends Response {
        loans: LoanStatus[];
    }

    export interface Collateral {
        coin_symbol: string;
        asset_code: string;
        asset_issuer: string;
        collateral_rate: number;
        warning_rate: number;
        liquidation_rate: number;
        created_by: string;
        created_date: Date;
        last_modified_by: string;
        last_modified_date: Date;
    }

    export interface LoanStatus {
        id: number;
        public_key: string;
        coin_symbol: string;
        collateral_issuer: string;
        collateral_asset_code: string;
        collateral_amount: number;
        collateral_price: number;
        collateral_rate: number;
        warning_rate: number;
        liquidation_rate: number;
        amount: number;
        fee: number;
        loaned_date: Date;
        transaction_hash: string;
        add_collateral_amount: number;
        sum_collateral_amount: number;
    }

    export interface Transaction {
        id: string;
        public_key: string;
        category: string;
        transaction: string;
        asset_code: string;
        asset_issuer: string;
        amount: number;
        counterpart: string;
        transaction_hash: string;
        created_by: string;
        created_date: Date;
    }
}

// todo AOP (cache decorator) --sky
export function getOrAddWalletItem(code: string, issuer: string, isNative: boolean): NWallet.AssetItem {
    if (code === 'XLM' && isNative === true) {
        issuer = 'native';
    }

    const key = `${code}_${issuer}`;

    if (AssetMap.has(key)) {
        return AssetMap.get(key);
    } else {
        const asset = new Asset(code, issuer);
        if (code === 'NCH' && isNative) {
            NWallet.Assets.NCH = asset;
        }

        if (code === 'NCN' && isNative) {
            NWallet.Assets.NCN = asset;
        }

        return AssetMap.set(key, <NWallet.AssetItem>{
            asset: asset,
            price: 0,
            isNative: isNative,
        }).get(key);
    }
}
