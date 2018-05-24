export namespace NWallet {
    export const WalletEmpty: Wallet[] = [{ name: 'empty', amount: 0 }];
    export const AddressEmpty: Address = { location: 'empty address' };

    export interface Account {
        signature: Signature;
        address: Address;
        wallets: Wallet[];
    }

    export interface Address {
        location: string;
    }

    export interface Profile {
        firstName: string;
        middleName?: string;
        lastName: string;
        phoneNumber: { countryCode: number; number: number };
    }

    export interface Signature {
        public: string;
        private: string;
    }

    export interface Wallet {
        name: string;
        amount: number;
    }
}
