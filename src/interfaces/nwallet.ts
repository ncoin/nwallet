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

    //todo move to other namespace

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

const Assets = new Map<string, NWallet.AssetItem>([
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


    // todo

    export interface Response {}


    // todo
    export interface XDRResponse extends Response {
        id: string;
        xdr: string;
    }
}

//todo AOP (cache decorator) --sky
export function getOrAddWalletItem(code: string, issuer: string, isNative: boolean): NWallet.AssetItem {
    if (code === 'XLM' && isNative === true) {
        issuer = 'native';
    }

    const key = `${code}_${issuer}`;

    if (Assets.has(key)) {
        return Assets.get(key);
    } else {
        const asset = new Asset(code, issuer);
        if (code === 'NCH' && isNative) {
            NWallet.Assets.NCH = asset;
        }

        if (code === 'NCN' && isNative) {
            NWallet.Assets.NCN = asset;
        }

        return Assets.set(key, <NWallet.AssetItem>{
            asset: asset,
            price: 0,
            isNative: isNative,
        }).get(key);
    }
}
