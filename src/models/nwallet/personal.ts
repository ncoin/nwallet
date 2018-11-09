import { env } from '../../environments/environment';
import { Debug } from '../../utils/helper/debug';

export class Personal {
    public email: string;
    public phoneNumber = '';
    private pincode: string;
    public pincodeEnabled: boolean;

    constructor() {
        if (env.name === 'dev') {
            // this.email = 'sample@email.com';
            // this.phoneNumber = '+82-1068116550';
            // this.pincodeEnabled = true;
        }
    }

    public clear(): void {
        Debug.Clear(this);
    }
}
