$("#item_order_quantity").val(0);
$("#order_input_discount").val(0);

$(document).ready(function () {
    let nextOrderId = generateNextOrderID();
    $("#order_id").val(nextOrderId);

    let currentDate = new Date();
    var formattedDate = currentDate.toISOString().split('T')[0];
    $("#order_date").val(formattedDate);

    loadItemCodes();
    loadCustIds();
});

$("#cus_order_id").on("change", function () {
    let selectedOption = $(this).val();

    let customer = o_findCustomer(selectedOption);
    $("#cus_order_name").text(customer.name);
    $("#cus_order_contact").text(customer.contact);
});

$("#item_order_id").on("change", function () {
    let selectedOption = $(this).val();

    let item = o_findItem(selectedOption);
    $("#order_lbl_item_name").text(item.name);
    $("#order_lbl_item_price").text(item.price);
    $("#order_lbl_item_available").text(item.quantity);
});


let finalTotal;
let subTotal;
$("#btnAddToCart").click(function () {
    let itmCode = $("#item_order_id").val();
    let itmName = $("#order_lbl_item_name").text();
    let unitPrice = $("#order_lbl_item_price").text();
    let qty = $("#item_order_quantity").val();
    let total = parseFloat(unitPrice) * parseFloat(qty);

    if (itmCode != null) {
        let itemDBQty = parseFloat($("#order_lbl_item_available").text());
        let tableCheck = "notFound";
        $("#order_tablebody tr").each(function () {
            let cellData = $(this).find("td:eq(0)").text();
            if (itmCode == cellData) {     //if the itemCode is already in the table
                tableCheck = "found";
                let ordQtyValidResult = ordQtyValidation(qty);

                if (ordQtyValidResult) {
                    let crntQty = parseFloat($(this).find("td:eq(3)").text());
                    let newQty = crntQty + parseFloat(qty);

                    if (newQty > itemDBQty) {
                        alert("insufficient item amount. Please order less than the amount left.");
                    } else {
                        $(this).find("td:eq(3)").text(newQty);
                        let newTotal = parseFloat(unitPrice) * newQty;
                        $(this).find("td:eq(4)").text(newTotal);
                    }
                } else {
                    alert("Order quantity required");
                }
            }
        });

        if (tableCheck == "notFound") {
            let ordQtyValidResult = ordQtyValidation(qty);
            if (ordQtyValidResult) {
                if (parseFloat(qty) > itemDBQty) {
                    alert(`insufficient item amount. Please enter an amount less than ${itemDBQty}.`);
                } else {
                    let row = `<tr>
                   <td>${itmCode}</td>
                   <td>${itmName}</td>
                   <td>${unitPrice}</td>
                   <td>${qty}</td>
                    <td>${total}</td>
               </tr>`;

                    $("#order_tablebody").append(row);
                    orderTblRowClicked();
                }

            } else {
                alert("Order quantity required");
            }
        }
    } else {
        alert("Please select an item first")
    }

    finalTotal = 0;
    $("#order_tablebody tr").each(function () {
        let eachItemTotal = parseFloat($(this).find("td:eq(4)").text());
        finalTotal = finalTotal + eachItemTotal;
        $("#order_lbl_total").html("&nbsp;" + finalTotal + "/=");
    });

    let discount = $("#order_input_discount").val();
    if (discount === "") {
        subTotal = finalTotal;
    } else {
        let reduced_amount = (finalTotal / 100) * parseFloat(discount);
        subTotal = finalTotal - reduced_amount;
    }
    $("#order_lbl_subtotal").html("&nbsp;" + subTotal + "/=");
});

$("#order_input_discount").on("keyup", function (e) {
    if (finalTotal == undefined) {

    } else {
        let discount = $("#order_input_discount").val();
        if (discount === "") {
            subTotal = finalTotal;
        } else {
            let reduced_amount = (finalTotal / 100) * parseFloat(discount);
            subTotal = finalTotal - reduced_amount;
        }
        $("#order_lbl_subtotal").html("&nbsp;" + subTotal + "/=");
    }
});


$("#Purchase-btn").click(function () {
    if ($("#cus_order_id").val() != null) {
        if ($("#order_tablebody tr").length == 0) {
            alert("Add something to the cart before trying to purchase")
        } else {
            let orderId = $("#order_id").val();
            let orderDate = $("#order_date").val();
            let custId = $("#cus_order_id").val();
            let discount = parseFloat($("#order_input_discount").val());
            let finalPrice = subTotal;
            let orderDetails = [];

            if (discount >= 0 && discount <= 100) {
                if ($("#order_input_cash").val() == "") {
                    alert("input cash amount before purchasing")
                } else {
                    $("#order_tablebody tr").each(function () {
                        let orderDetail = {
                            itmCode: $(this).children().eq(0).text(),
                            price: $(this).children().eq(2).text(),
                            quantity: $(this).children().eq(3).text()
                        }
                        orderDetails.push(orderDetail);

                        //reduce item quantity from the itemDB array
                        // let item = o_findItem(orderDetail.itmCode);
                        let newQtyLeft = item.quantity - orderDetail.quantity;
                        item.quantity = newQtyLeft;
                    });

                    let newOrder = Object.assign({}, order);

                    newOrder.oid = orderId;
                    newOrder.orderDate = orderDate;
                    newOrder.custID = custId;
                    newOrder.discount = discount;
                    newOrder.finalPrice = finalPrice;
                    newOrder.orderDetails = orderDetails;

                    orderDB.push(newOrder);

                    alert("Order Placed Successfully");

                    let nextOrderId = generateNextOrderID();
                    $("#order_id").val(nextOrderId);

                    let currentDate = new Date();
                    var formattedDate = currentDate.toISOString().split('T')[0];
                    $("#order_date").val(formattedDate);

                    document.getElementById("cus_order_id").selectedIndex = -1;
                    document.getElementById("order_id").selectedIndex = -1;
                    $("#item_order_quantity").val(0);
                    $("#order_input_discount").val(0);
                    $("#order_tablebody").empty();
                    $("#cus_order_name,#cus_order_contact,#order_lbl_item_name,#order_lbl_item_price,#order_lbl_item_available,#order_lbl_total,#order_lbl_subtotal").text("");
                    $("#order_input_cash,#order_input_balance").val("");
                    finalTotal = 0;
                    subTotal = 0;
                }
            } else {
                alert("discount must be between 0 and 100");
            }
        }
    } else {
        alert("Please select a customer ID")
    }
});


$("#order_input_cash").on("keyup", function () {
    let cash = parseFloat($("#order_input_cash").val());
    let balance = cash - subTotal;
    if (isNaN(balance)) {
    } else {
        if (balance >= 0) {
            $("#order_input_balance").val(balance);
            $("#order_purchase_btn").prop("disabled", false);
            $("#order_input_cash").css({
                "background-color": "white",
                "color": "black"
            });
        } else {
            $("#order_purchase_btn").prop("disabled", true);
            $("#order_input_cash").css({
                "background-color": "#eb4a4c",
                "color": "white"
            });
            $("#order_input_balance").val("Insufficient Cash");
        }
    }
});

function orderTblRowClicked() {
    $("#order_tablebody tr:last-of-type").dblclick(function () {
        let result = confirm("are you sure to remove this item form the cart?")
        if (result) {
            $(this).remove();

            finalTotal = 0;
            if ($("#order_tablebody tr").length == 0) {
                $("#order_lbl_total").html(0);
            } else {
                $("#order_tablebody tr").each(function () {
                    let eachItemTotal = parseFloat($(this).find("td:eq(4)").text());
                    finalTotal = finalTotal + eachItemTotal;
                    $("#order_lbl_total").html("&nbsp;" + finalTotal + "/=");
                });
            }

            let discount = $("#order_input_discount").val();
            if (discount === "") {
                subTotal = finalTotal;
            } else {
                let reduced_amount = (finalTotal / 100) * parseFloat(discount);
                subTotal = finalTotal - reduced_amount;
            }
            $("#order_lbl_subtotal").html("&nbsp;" + subTotal + "/=");
        }
    });
}

function generateNextOrderID() {
    const highestOrderID = orderDB.reduce((max, order) => {
        const orderNumber = parseInt(order.oid.split('-')[1]);
        return orderNumber > max ? orderNumber : max;
    }, 0);

    const nextOrderNumber = highestOrderID + 1;
    return `OID-${String(nextOrderNumber).padStart(3, '0')}`;
}

// load CustId to Index

function loadCustIds() {
    for (let i = 0; i < customerDB.length; i++) {
        let custId = customerDB[i].id;

        $("#cus_order_id").append(`<option>${custId}</option>`)
    }
    document.getElementById("cus_order_id").selectedIndex = -1;
}

function loadItemCodes() {
    for (let i = 0; i < itemDB.length; i++) {
        let itemCode = itemDB[i].id;

        $("#item_order_id").append(`<option>${itemCode}</option>`)
    }
    document.getElementById("item_order_id").selectedIndex = -1;
}

function o_findCustomer(id) {
    return customerDB.find(function (customer) {
        return customer.id == id;
    });
}

function o_findItem(id) {
    return itemDB.find(function (item) {
        return item.id == id;
    });
}