import { NWallet } from '../../interfaces/nwallet/account';
export class WalletItem implements NWallet.Item {
    name: string;
    amount: number;
}
