import Stellar, { Asset, Keypair } from 'stellar-sdk';

export class Sample {
    public Func() {
        Asset.native();
    }

    private async processXdr(): Promise<void> {
        // const account = await this.account.getAccount();
        const sig = { public_key: 'PUB', private_key: 'PVT' };
        const xdrResponse = await this.requestXDR();

        if (xdrResponse) {
            // transaction from xdr;
            const transaction = new Stellar.Transaction(xdrResponse.xdr);
            // sign
            transaction.sign(Keypair.fromSecret(sig.private_key));

            // transaction to xdr;
            const toXdr = transaction
                .toEnvelope()
                .toXDR()
                .toString('base64');

            this.executeXDR(toXdr);
        }
    }

    public requestXDR(): { xdr: string } {
        // http comm
        return { xdr: '' };
    }

    public executeXDR(xdr: string) {
        // http comm
    }
}
