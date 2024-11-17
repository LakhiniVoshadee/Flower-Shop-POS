getAllCustomers();

// ------------clear function ------------
$("#cus_clear").click(function () {
    clearTxtFields();
});

//save btn action
$("#cus_save").click(function () {
    saveCustomer();
    // $("#o_inputCustId").empty();
    // loadCustIds();
    getAllCustomers();
    clearTxtFields();
    setBtn();
});

//update btn action
$("#cus_update").click(function () {
    let id = $("#customer_id").val();
    updateCustomer(id.trim());
    getAllCustomers();
    clearTxtFields();
});

//delete btn action
$("#cus_delete").click(function () {
    let id = $("#customer_id").val();
    deleteCustomer(id.trim());
    getAllCustomers();
    clearTxtFields();
});

//search btn action
$("#btnSearchCustomer").click(function () {
    let custId = $("#txtCustomerSearch").val();

    let customer = findCustomer(custId.trim());

    if (customer == undefined) {
        alert(`no customer found with the ID: ${custId} . Please try again.`);
        $("#txtCustomerSearch").val("");
    } else {
        setDataToTxtFields(
            customer.id,
            customer.name,
            customer.address,
            customer.contact
        );
        $("#c_collapseOne").collapse("show");
        $("#txtCustomerSearch").val("");
    }
});

function clearTxtFields() {
    $("#customer_id,#customer_name,#customer_address,#customer_contact").val("");
    $("#customer_id,#customer_name,#customer_address,#customer_contact").addClass(
        "border-secondary-subtle"
    );
    setBtn();
    $(".err-label").css("display", "none");
}

function saveCustomer() {
    let custId = $("#customer_id").val();

    if (findCustomer(custId.trim()) == undefined) {
        let custName = $("#customer_name").val();
        let custAddress = $("#customer_address").val();
        let custContact = $("#customer_contact").val();

        let newCustomer = Object.assign({}, customer);

        newCustomer.id = custId;
        newCustomer.name = custName;
        newCustomer.address = custAddress;
        newCustomer.contact = custContact;

        customerDB.push(newCustomer);
    } else {
        alert(`customer with the ID: ${custId} already exists.`);
    }
}

function updateCustomer(id) {
    let customer = findCustomer(id);

    if (customer == undefined) {
        alert(`No customer with the ID: ${id} . Please check the ID again.`);
    } else {
        let result = confirm("Confirm customer details updating process?");
        if (result) {
            let custName = $("#customer_name").val();
            let custAddress = $("#customer_address").val();
            let custContact = $("#customer_contact").val();

            customer.name = custName;
            customer.address = custAddress;
            customer.contact = custContact;
        }
    }
}

function deleteCustomer(id) {
    let customer = findCustomer(id);

    if (customer == undefined) {
        alert(`No customer with the ID: ${id} . Please check the ID again.`);
    } else {
        let result = confirm("Are you sure you want to remove this customer?");
        if (result) {
            let status = "pending";
            for (let i = 0; i < customerDB.length; i++) {
                if (customerDB[i].id == id) {
                    customerDB.splice(i, 1);
                    status = "done";
                    alert("customer deleted successfully");
                }
            }
            if (status == "pending") {
                alert("customer not removed");
            }
        }
    }
}

function findCustomer(id) {
    return customerDB.find(function (customer) {
        return customer.id == id;
    });
}

function getAllCustomers() {
    $("#customerTableBody").empty();

    for (let i = 0; i < customerDB.length; i++) {
        let id = customerDB[i].id;
        let name = customerDB[i].name;
        let address = customerDB[i].address;
        let contact = customerDB[i].contact;

        let row = `<tr>
                   <td>${id}</td>
                   <td>${name}</td>
                   <td>${address}</td>
                   <td>${contact}</td>
                   </tr>`;

        $("#customerTableBody").append(row);
    }
    onTblRowClick();
}

function onTblRowClick() {
    let singleClickTimer;

    $("#customerTableBody>tr").on("mousedown", function (event) {
        if (event.which === 1) {
            // Left mouse button (1) clicked
            let row = $(this);
            if (singleClickTimer) {
                clearTimeout(singleClickTimer);
                singleClickTimer = null;
                // Handle double click
                deleteCustomer(row.children().eq(0).text());
                getAllCustomers();
            } else {
                singleClickTimer = setTimeout(function () {
                    singleClickTimer = null;
                    // Handle single click
                    let id = row.children().eq(0).text();
                    let name = row.children().eq(1).text();
                    let address = row.children().eq(2).text();
                    let contact = row.children().eq(3).text();
                    setDataToTxtFields(id, name, address, contact);
                    $("#c_collapseOne").collapse("show");
                    $("#c_collapseOne")[0].scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }, 300); // Adjust the delay (300 milliseconds) as needed
            }
        }
    });
}

function setDataToTxtFields(id, name, address, contact) {
    $("#customer_id").val(id);
    $("#customer_name").val(name);
    $("#customer_address").val(address);
    $("#customer_contact").val(contact);

    $("#customer_id,#customer_name,#customer_address,#customer_contact").addClass(
        "border-secondary-subtle"
    );
    setBtn();
}
