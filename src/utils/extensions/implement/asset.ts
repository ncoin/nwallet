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

export function initProtocolStatic(this: Item, data: Data): Item {
    if (this.data) {
        throw new Error('Asset already initialized');
    }

    this.data = data;
    processData(this, data);

    this.option = {
        isActive: true,
        isShow: <boolean>this.data.is_show,
        order: this.data.align_number
    };

    return this;
}

export function updateProtocolStatic(this: Item, data: Data): Item {
    if (!this.data) {
        throw new Error('Asset not initialize yet');
    }

    Object.assign(this.data, data);
    processData(this, data);

    this.option.isActive = true;
    this.option.isShow = <boolean>this.data.is_show;
    this.option.order = this.data.align_number;

    return this;
}

Item.prototype.initData = initProtocolStatic;
Item.prototype.updateData = updateProtocolStatic;
