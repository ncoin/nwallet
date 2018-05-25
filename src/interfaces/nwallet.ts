import { Asset } from 'stellar-sdk';
export namespace NWallet {
    export const WalletEmpty: WalletItem[] = [{ asset: Asset.native(), amount: '0' }];
    export const AddressEmpty: Address = { location: 'empty address' };
    export const ProfileEmpty: Profile = { firstName: 'john', lastName : 'doe', phoneNumber : { countryCode : '00', number: '000000' } };

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
    }
}
