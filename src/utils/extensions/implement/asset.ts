import { Item, Data } from '../../../models/nwallet/asset';

function processData(item: Item, data: Data): void {
    item.data.is_show = data.is_show === 1;
    item.data.created_date = new Date(data.created_date);
    item.data.last_modified_date = new Date(item.data.last_modified_date);

    Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
            throw new Error(`invalid parameter, object : Data, property = ${key}`);
        }
    });
}

export function toProtocolStatic(this: Item): (data: Data) => Item {
    return (data: Data) => {
        if (this.data) {
            throw new Error('Asset already initialized');
        }

        this.data = data;
        processData(this, data);

        this.detail = {
            code: this.data.currency_manage_id,
            symbol: this.data.currency,
            price: 1
        };

        this.option = {
            isActive: true,
            isShow: <boolean>this.data.is_show,
            order: this.data.align_number
        };

        return this;
    };
}

let price = 0;
export function updateProtocolStatic(this: Item, data: Data): Item {
    if (!this.data) {
        throw new Error('Asset not initialize yet');
    }

    Object.assign(this.data, data);
    processData(this, data);

    this.detail.price = price++;

    this.option.isActive = true;
    this.option.isShow = <boolean>this.data.is_show;
    this.option.order = this.data.align_number;

    return this;
}

Item.prototype.toProtocol = toProtocolStatic;
Item.prototype.updateProtocol = updateProtocolStatic;
