export interface RequestBase {
    [param: string]: string | string[];
}

export enum Types {
    Transfer = 'transactions/stellar/accounts/',
    LoanStatus = 'loans/ncash/stellar/',
    LoanDetail = 'loans/ncash/stellar/',
    Collateral = 'loans/ncash/collateral'
}
