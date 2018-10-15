import { env } from '../../environments/environment';

export class Personal {
    public email: string;
    public phoneNumber: string;
    private pincode: string;
    public pincodeEnabled: boolean;

    constructor() {
        if (env.name === 'dev') {
            this.email = 'sample@email.com';
            this.phoneNumber = '+82-1088888888';
            this.pincodeEnabled = true;
        }
    }

    public getUserName(): string {
        return this.phoneNumber.replace('+', '').replace('-', '');
    }
}
