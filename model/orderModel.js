class orderModel{
    constructor(order_id,item_id,qty,unit_price) {
        this._order_id = order_id;
        this._item_id = item_id;
        this._qty = qty;
        this._unit_price = unit_price;
    }

    get order_id() {
        return this._order_id;
    }

    set order_id(value) {
        this._order_id = value;
    }

    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get unit_price() {
        return this._unit_price;
    }

    set unit_price(value) {
        this._unit_price = value;
    }
}