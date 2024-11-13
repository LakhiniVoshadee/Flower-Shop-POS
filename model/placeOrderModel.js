class placeOrderModel{
    constructor(order_id,customer_id,date,item_id,payment) {
        this._order_id = order_id;
        this._customer_id = customer_id;
        this._date = date;
        this._item_id = item_id;
        this._payment = payment;

    }

    get order_id() {
        return this._order_id;
    }

    set order_id(value) {
        this._order_id = value;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get payment() {
        return this._payment;
    }

    set payment(value) {
        this._payment = value;
    }
}