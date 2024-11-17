document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        if (section.id !== "home-section") {
            section.style.display = "none";
        }
    });

    document.getElementById("nav-home").addEventListener("click", function () {
        toggleSection("home-section");
    });
    document
        .getElementById("nav-customer")
        .addEventListener("click", function () {
            toggleSection("customer-section");
        });
    document.getElementById("nav-item-link").addEventListener("click", function () {
        toggleSection("item-section");
    });
    document
        .getElementById("nav-place-order")
        .addEventListener("click", function () {
            toggleSection("placeorder-section");
        });
});

function toggleSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}