import { Debug } from '../../utils/helper/debug';
import { NWData, NWResponse, NWAsset } from '../nwallet';

/** wallet protocol interface */
export class Data {}

/** asset option information */
export class Option {}

/** asset information */
export class Item {
    /** asset option */
    public option: Option;
    public currency: NWData.Currency;

    constructor(public data: Data) {
        this.option = {
            isActive: true,
            isShow: <boolean>this.data.is_show,
            order: this.data.align_number
        };

        if (this.hasCollateral()) {
            this.data.collateral = Object.assign(new NWAsset.Collateral(), this.data.collateral);
        }
    }

    // todo property

    public setCurrency(currency: NWData.Currency) {
        this.currency = currency;
    }

    public getSymbol(): string {
        Debug.assert(this.data);
        return this.currency.label;
    }

    public getAmount(): number {
        Debug.assert(this.data);
        return this.data.balance;
    }

    /** symbol id */
    public getCurrencyId(): number {
        Debug.assert(this.data);
        return this.data.currency_id;
    }

    public getWalletId(): number {
        Debug.assert(this.data);
        return this.data.id;
    }

    public getAddress(): string {
        Debug.assert(this.data);
        return this.data.address;
    }

    public hasCollateral(): boolean {
        return this.data.collateral !== undefined && this.data.collateral !== undefined;
    }

    public get Collateral(): NWAsset.Collateral {
        return this.data.collateral;
    }

    public get CanLoan(): boolean {
        return this.currency.can_loan;
    }

    public get WithdrawFee(): number {
        return this.currency.fee;
    }
}

export class Collateral {
    public get Id(): number {
        return this.id;
    }
    public get Available(): number {
        return this.available_loan_amout;
    }
    public get Loaned(): number {
        return this.loan_sum;
    }
    public get Lock(): number {
        return this.lock_balance;
    }

    public get Ltv(): number {
        return this.ltv;
    }

    public get Expiry(): string {
        return this.expiry_date;
    }

    public get Interest(): number {
        return 9999;
    }

    public get Fee(): number {
        return 9999;
    }
}

export class Available {
    constructor(data: NWResponse.Asset.Available) {
        Object.assign(this, data);
        Debug.assert(this);
    }

    public get Symbol() {
        return this.label;
    }

    public get Id() {
        Debug.assert(this.currency_id);
        return this.currency_id;
    }

    public get WalletId() {
        return this.bitgo_wallet_id;
    }

    // public getSymbol(): string {
    //     //return this.currency;
    // }

    // public setAlign(value: number): void {
    //     this.align_number = value;
    // }

    // public getAlign(): number {
    //     return this.align_number;
    // }
}
