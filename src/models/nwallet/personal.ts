import { Debug } from '../../utils/helper/debug';

export class Personal {
    public email: string;
    public phoneNumber = '';
    private pincode: string;
    public pincodeEnabled: boolean;

    constructor() {}

    public init(data: Personal): this {
        Object.assign(this, data);
        return this;
    }

    public clear(): void {
        Debug.Clear(this);
    }
}
