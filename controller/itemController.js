getAllItems();

// ------------clear function ------------
$("#item_clear").click(function (event) {
    event.preventDefault();
    clearItemTxtFields();
});

//save btn action
$("#item_save").click(function (event) {
    event.preventDefault();
    $("#item_id").empty();
    saveItem();
    loadItemCodes();
    getAllItems();
    clearItemTxtFields();
});

//update btn action
$("#item_update").click(function (event) {
    event.preventDefault();
    let id = $("#item_id").val();
    updateItem(id.trim());
    getAllItems();
    clearItemTxtFields();
});

//delete btn action
$("#item_delete").click(function (event) {
    event.preventDefault();
    let id = $("#item_id").val();
    deleteItem(id.trim());
    getAllItems();
    clearItemTxtFields();
});

//search btn action
$("#btnSearchItem").click(function (event) {
    event.preventDefault();
    let itmId = $("#txtItemSearch").val();

    let item = findItem(itmId.trim());

    if (item == undefined) {
        alert(`no item found with the code: ${itmId} . Please try again.`);
        $("#txtItemSearch").val("");
    } else {
        setDataToItemTxtFields(item.id, item.name, item.quantity, item.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
        $("#i_collapseOne").collapse("show");
        $("#txtItemSearch").val("");
    }
})

function clearItemTxtFields() {
    $("#item_id,#item_name,#item_quantity,#item_price").val("");
    $("#item_id,#item_name,#item_quantity,#item_price").addClass("border-secondary-subtle");
    setItemBtn();
    $(".i_err-label").css("display", "none");
}

function saveItem() {
    let itmCode = $("#item_id").val();

    if (findItem(itmCode.trim()) == undefined) {
        let itmName = $("#item_name").val();
        let itmQty = $("#item_quantity").val();
        let itmUnitPrice = $("#item_price").val();

        let newItem = Object.assign({}, item);

        newItem.id = itmCode;
        newItem.name = itmName;
        newItem.quantity = itmQty;
        newItem.price = itmUnitPrice;

        itemDB.push(newItem);
    } else {
        alert(`item with the code: ${itmCode} already exists.`);
    }
}

function updateItem(id) {
    let item = findItem(id);

    if (item == undefined) {
        alert(`No item with the code: ${id} . Please check the code again.`);
    } else {
        let result = confirm("Confirm item details updating process?");
        if (result) {
            let itmName = $("#item_name").val();
            let itmQty = $("#item_quantity").val();
            let itmUnitPrice = $("#item_price").val();

            item.name = itmName;
            item.quantity = itmQty;
            item.price = itmUnitPrice;
        }
    }
}


function deleteItem(id) {
    let item = findItem(id);

    if (item == undefined) {
        alert(`No item with the code: ${id} . Please check the code again.`);
    } else {
        let result = confirm("Are you sure you want to remove this item?");
        if (result) {
            let status = "pending"
            for (let i = 0; i < itemDB.length; i++) {
                if (itemDB[i].id == id) {
                    itemDB.splice(i, 1);
                    status = "done"
                    alert("item deleted successfully")
                }
            }
            if (status == "pending") {
                alert("item not removed")
            }
        }
    }
}

function findItem(id) {
    return itemDB.find(function (item) {
        return item.id == id;
    });
}

function getAllItems() {
    $("#itemTableBody").empty();

    for (let i = 0; i < itemDB.length; i++) {
        let code = itemDB[i].id;
        let name = itemDB[i].name;
        let qty = itemDB[i].quantity;
        let unitPrice = itemDB[i].price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});


        let row = `<tr>
                   <td>${code}</td>
                   <td>${name}</td>
                   <td>${qty}</td>
                   <td>${unitPrice}</td>
                   </tr>`;

        $("#itemTableBody").append(row);
    }
    onTblItemRowClick()
}

function onTblItemRowClick() {
    let singleClickTimer;

    $("#itemTableBody>tr").on("mousedown", function (event) {
        if (event.which === 1) { // Left mouse button (1) clicked
            let row = $(this);
            if (singleClickTimer) {
                clearTimeout(singleClickTimer);
                singleClickTimer = null;
                // Handle double click
                deleteItem(row.children().eq(0).text());
                getAllItems();
            } else {
                singleClickTimer = setTimeout(function () {
                    singleClickTimer = null;
                    // Handle single click
                    let code = row.children().eq(0).text();
                    let name = row.children().eq(1).text();
                    let qty = row.children().eq(2).text();
                    let unitPrice = row.children().eq(3).text();
                    setDataToItemTxtFields(code, name, qty, unitPrice);
                    $("#i_collapseOne").collapse("show");
                    $("#i_collapseOne")[0].scrollIntoView({behavior: "smooth", block: "center"});
                }, 300); // Adjust the delay (300 milliseconds) as needed
            }
        }
    });
}

function setDataToItemTxtFields(code, name, qty, unitPrice) {
    $("#item_id").val(code);
    $("#item_name").val(name);
    $("#item_quantity").val(qty);
    $("#item_price").val(unitPrice);

    $("#item_id,#item_name,#item_quantity,#item_price").addClass("border-secondary-subtle");
    setItemBtn();
}