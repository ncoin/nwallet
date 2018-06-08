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
    export const WalletEmpty: WalletItem[] = [{ asset: Asset.native(), amount: '0', price: 0 }];
    export const AddressEmpty: Address = { location: 'empty address' };
    export const ProfileEmpty: Profile = { firstName: 'john', lastName: 'doe', phoneNumber: { countryCode: '00', number: '000000' } };
    export const TransactionEmpty: Transaction[] = [{ type: '', item: { amount: '', asset: Asset.native(), price: 0 }, date: new Date() }];

    export interface Account {
        isActivate: boolean;
        signature: Signature;
        address: Address;
        profile: Profile;
        wallets: WalletItem[];
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
        amount: string;
        price: number;
    }

    export interface Transaction {
        type: string;
        item: WalletItem;
        date: Date;
    }

    export const NCN = new Asset('NCN', 'GD5KULZRARHGYJHDKDCUYHTY645Z4NP7443WS4HQJSNX45BMHV5CCTM3');
    export const NCH = new Asset('NCH', 'GD5KULZRARHGYJHDKDCUYHTY645Z4NP7443WS4HQJSNX45BMHV5CCTM3');
    export const XLM = Asset.native();

    export interface TransactionRecord {
        current: any;
        records: () => NWallet.Transaction[];
        next: () => Promise<void>;
    }
}

export const Assets = new Map<string, Asset>([[`${NWallet.NCH.code}_${NWallet.NCH.issuer}`, NWallet.NCH], [`${NWallet.NCN.code}_${NWallet.NCN.issuer}`, NWallet.NCN], ['XLM', Asset.native()]]);

export function getOrAddAsset(code: string, issuer: string, assetType:string): Asset{
    if (assetType === 'native')
        return Asset.native();
    const key = `${code}_${issuer}`;
    if (Assets.has(key)){
        return Assets.get(key);
    }else {
        Assets.set(key, new Asset(code, issuer)).get(key);
    }
};
