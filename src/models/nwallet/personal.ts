export class Personal {
    public email: string;
    public phoneNumber: string;
    private pincode: string;
    public pincodeEnabled: boolean;

    constructor() {
        this.email = 'sample@email.com';
        this.phoneNumber = '+01-23456789';
        this.pincodeEnabled = true;
    }
}
