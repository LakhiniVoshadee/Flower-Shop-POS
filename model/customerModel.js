class customerModel {
  constructor(customer_id, name, address, contact) {
      this._customer_id = customer_id;
      this._name = name;
      this._address = address;
      this._contact = contact;
  }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get contact() {
        return this._contact;
    }

    set contact(value) {
        this._contact = value;
    }
}
