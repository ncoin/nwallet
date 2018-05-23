export namespace NWallet {

    export interface Account {
        publicKey: string;
        privateKey: string;
    }

    export interface Item {
        name: string;
        amount: number;
    }
}



