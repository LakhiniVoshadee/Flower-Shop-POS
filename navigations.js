function showSection(sectionId, linkId) {
    const sections = [
        "home-section",
        "customer-section",
        "item-section",
        "placeorder-section",
    ];
    const links = [
        "nav-home",
        "nav-customer",
        "nav-item-link",
        "nav-place-order",
    ];

    sections.forEach((id, index) => {
        const section = document.getElementById(id);
        const link = document.getElementById(links[index]);

        if (id === sectionId) {
            section.style.display =
                section.style.display === "block" ? "none" : "block";
        } else {
            section.style.display = "none";
        }
    });
}

document.getElementById("nav-home").addEventListener("click", function (event) {
    event.preventDefault();
    showSection("home-section", "nav-home");
});

document
    .getElementById("nav-customer")
    .addEventListener("click", function (event) {
        event.preventDefault();
        showSection("customer-section", "nav-customer");
    });
document
    .getElementById("nav-item-link")
    .addEventListener("click", function (event) {
        event.preventDefault();
        showSection("item-section", "nav-item-link");
    });

document
    .getElementById("nav-place-order")
    .addEventListener("click", function (event) {
        event.preventDefault();
        showSection("placeorder-section", "nav-place-order");
    });
