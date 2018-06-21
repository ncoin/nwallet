import { Asset } from 'stellar-sdk';
export namespace NWallet {

    export interface Account {
        isActivate: boolean;
        signature: Signature;
        address: Address;
        profile: Profile;
        wallets: WalletContext[];
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

    export interface WalletItem {
        asset: Asset;
        isNative: boolean;
        price: number;
    }

    export interface WalletContext {
        item: WalletItem;
        amount: string;
    }

    //todo move to other namespace

    export const Assets = {
        NCH: <Asset>undefined,
        NCN: <Asset>undefined,
        XLM: Asset.native(),
    };
    export const NCH = new Asset('NCH', 'GD5KULZRARHGYJHDKDCUYHTY645Z4NP7443WS4HQJSNX45BMHV5CCTM3');
}

export namespace NWallet.Transactions {
    export interface Context {
        pageToken: string;
        records: NWallet.Transactions.Record[];
        hasNext: boolean;
    }

    export interface Record {
        type: string;
        context: WalletContext;
        date: Date;
    }

    export function parseRecords(asset: Asset, data: Object): Record[] {
        const rawRecords = data['records'] as Object[];
        return rawRecords
            .map<Record>(raw => {
                const asset = getOrAddAsset(
                    raw['asset']['code'],
                    raw['asset']['issuer'],
                    ['asset']['code'] === 'XLM' && raw['asset']['issuer'] === undefined ? 'native' : undefined,
                );
                return <Record>{
                    type: raw['type'],
                    context: <WalletContext>{
                        item: <WalletItem> {
                            asset: asset,
                            price: 0
                        },
                        amount: raw['amount'],
                    },
                    date: raw['created_at'],
                };
            })
            .filter(record => {
                //todo extract --sky
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

export const Assets = new Map<string, Asset>();

//todo AOP (cache decorator) --sky
export function getOrAddAsset(code: string, issuer: string, assetType: string): Asset {
    if (assetType === 'native') {
        return Asset.native();
    }

    const key = `${code}_${issuer}`;

    if (Assets.has(key)) {
        return Assets.get(key);
    } else {
        return Assets.set(key, new Asset(code, issuer)).get(key);
    }
}
