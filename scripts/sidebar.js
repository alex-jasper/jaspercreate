$(document).ready(function() {
    // Load the sidebar content
    $("#sidebar").load("sidebar.html", function() {
        console.log("Sidebar loaded.");

        // Load a default page after the sidebar is ready
        $('.content').load("pages/home.html", function(response, status, xhr) {
            if (status === "error") {
                console.log("Error loading default page:", xhr.status, xhr.statusText);
            }
        });
    });

    // Use delegated event handling for sidebar links to ensure they always work
    $(document).on('click', '#sidebar a[data-page]', function(e) {
        e.preventDefault(); // Prevent default anchor behavior

        var page = $(this).data('page'); // Get page from data attribute

        // Load specified page if data-page attribute is defined
        if (page) {
            $('.content').load(page, function(response, status, xhr) {
                if (status === "error") {
                    console.log("Error loading page:", xhr.status, xhr.statusText);
                } else {
                    console.log("Page loaded:", page);
                }
            });
        } else {
            console.log("No page specified in data-page attribute.");
        }
    });
});

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var content = document.querySelector(".content");
    var hamburger = document.querySelector(".hamburger-column");

    // Toggle the "closed" class on the sidebar
    sidebar.classList.toggle("closed");

    if (sidebar.classList.contains("closed")) {
        sidebar.style.width = "0%";
        content.style.width = "96.5%";
        hamburger.style.width = "3.5%";
    } else {
        sidebar.style.width = "20%";
        content.style.width = "76.5%";
        hamburger.style.width = "3.5%";
    }
}