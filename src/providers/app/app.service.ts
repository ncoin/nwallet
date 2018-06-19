import { testAccount } from './../nsus/naccount';
import { AccountProvider } from './../account/account';
import { NClientProvider } from './../nsus/nclient';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { App } from 'ionic-angular';
import { Logger } from '../common/logger/logger';
import { NWallet, getOrAddAsset } from '../../interfaces/nwallet';
import Stellar, { Asset, Keypair } from 'stellar-sdk';

interface Signable {
    sign(requestXDRfunc: (key: string) => Promise<string>): Signable;
    after: (afterfunction: (xdr: string) => Promise<string>) => Promise<string>;
}

/**
 * common config provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(private preference: PreferenceProvider, private app: App, private logger: Logger, private connector: NClientProvider, private account: AccountProvider) {

    }

    public async walkThrough(processFunc: () => void): Promise<void> {
        this.app;
        processFunc();
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    public async login(account: NWallet.Account): Promise<void> {
        await this.connector.fetchJobs(account);
        this.signer.sign(this.connector.requestTrustXDR).after(this.connector.executeTrustXDR);
    }

    public async logout(account: NWallet.Account): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
        await this.connector.unSubscribe(account);
        this.account.flush();
        this.logger.debug('logout', account.signature.public);
    }

    public async sendPayment(signature: NWallet.Signature, destination: string, asset: Asset, amount: string): Promise<void> {
        this.connector.sendPayment(signature, destination, asset, amount);
    }

    public async getTransactions(wallet: NWallet.WalletContext) {
        //todo fixme

        const account = await this.account.getAccount();
        const payments = await this.connector.getPayments(account.signature);
        if (payments) {
            const transaction = {
                current: payments,
                records: () => {
                    return transaction.current.records
                        .filter(record => {
                            let isEqual = false;
                            if (wallet.asset.isNative()) {
                                isEqual = record.asset_type === 'native';
                            } else {
                                isEqual = record.asset_code === wallet.asset.getCode() && record.asset_issuer === wallet.asset.getIssuer();
                            }

                            return record.type === 'payment' && isEqual;
                        })
                        .map(record => {
                            let type: string;
                            switch (record.from) {
                                case testAccount.user.pub:
                                    {
                                        type = 'sent';
                                    }
                                    break;
                                case testAccount.buy.pub:
                                    {
                                        type = 'bought';
                                    }
                                    break;
                                case testAccount.loan.pub:
                                    {
                                        type = 'rent';
                                    }
                                    break;
                                default:
                                    {
                                        type = 'received';
                                    }
                                    break;
                            }
                            return <NWallet.Transaction>{
                                type: type,
                                context: <NWallet.WalletContext>{
                                    amount: record.amount,
                                    asset: getOrAddAsset(record.asset_code, record.asset_issuer, record.asset_type),
                                },
                                date: record['created_at'],
                            };
                        });
                },
                next: async () => {
                    transaction.current = await transaction.current.next();
                },
            };
            return transaction;
        }
    }

    public async requestLoan(asset: Asset, amount: number): Promise<void> {
        this.signer.sign(key => this.connector.requestLoanXDR(key, asset, amount)).after(this.connector.executeLoanXDR);
    }

    public async requestBuy(asset: Asset, amount: number): Promise<void> {
        this.signer.sign(key => this.connector.requestBuyXDR(key, asset, amount)).after(this.connector.executeBuyXDR);
    }

    private get signer(): Signable {
        const signer = {

            requestXDR: undefined,
            sign:  (requstXDRexpr: (accountId: string) => Promise<string>): Signable => {
                signer.requestXDR = requstXDRexpr;
                return signer;
            },
            after: async (afterfunction:(xdr: string) => Promise<string>): Promise<string> => {
                const account = await this.account.getAccount();
                const signedXDR = await signer.requestXDR(account.signature.public).then(unsignedXDR => {
                    const transaction = new Stellar.Transaction(unsignedXDR);
                    transaction.sign(Keypair.fromSecret(account.signature.secret));
                    return transaction.toEnvelope().toXDR().toString('base64');
                });

                return await afterfunction(signedXDR);
            }
        }

        return signer;
    }
}
