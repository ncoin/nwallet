import { Context } from './nwallet';
import { Asset } from 'stellar-sdk';
export namespace NWallet {
    export const AccountEmpty: Account = {
        isActivate: false,
        signature: NWallet.SignatureEmpty,
        address: NWallet.AddressEmpty,
        profile: NWallet.ProfileEmpty,
        wallets: NWallet.WalletEmpty,
    };
    export const SignatureEmpty: Signature = { public: 'public key', secret: 'secret sig' };
    export const WalletEmpty: WalletContext[] = [{ asset: Asset.native(), amount: '0', price: 0 }];
    export const AddressEmpty: Address = { location: 'empty address' };
    export const ProfileEmpty: Profile = { firstName: 'john', lastName: 'doe', phoneNumber: { countryCode: '00', number: '000000' } };
    export const TransactionEmpty: Transactions.Record[] = [{ type: '', context: { amount: '', asset: Asset.native(), price: 0 }, date: new Date() }];

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

    export interface WalletContext {
        asset: Asset;
        amount: string;
        price: number;
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
                    raw['asset']['code'] === 'XLM' && raw['asset']['issuer'] === undefined ? 'native' : undefined,
                );
                return <Record>{
                    type: raw['type'],
                    context: <WalletContext>{
                        amount: raw['amount'],
                        asset: asset,
                        price: 0,
                    },
                    date: raw['created_at'],
                };
            })
            .filter(record => {
                //todo extract --sky
                if (asset.isNative() && record.context.asset.isNative()) {
                    return true;
                } else {
                    return (
                        asset.getCode() === record.context.asset.getCode() &&
                        asset.getIssuer() === record.context.asset.getIssuer() &&
                        asset.getAssetType() === record.context.asset.getAssetType()
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
