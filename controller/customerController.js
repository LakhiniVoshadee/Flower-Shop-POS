getAllCustomer();

//save btn action
$("#c_btnSave").click(function () {
  saveCustomer();
  $("#o_inputCusId").empty();
  loadCusIds();
  getAllCustomer();
  clearTextFields();
});
