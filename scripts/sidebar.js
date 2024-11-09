$(document).ready(function() {
    // Load the sidebar content
    $("#sidebar").load("sidebar.html", function() {
        // Load a default page
        $('.content').load("pages/home.html", function(response, status, xhr) {
            if (status === "error") {
                console.log("Error loading default page:", xhr.status, xhr.statusText);
            }
        });

        // After loading the sidebar, attach the click event handler to the links
        $('#sidebar').on('click', 'a', function(e) {
            var page = $(this).data('page'); // Get the page from data attribute
            var href = $(this).attr('href'); // Get the href attribute of the link

            // Check if the link is external (starts with http or https)
            if (href.startsWith("http://") || href.startsWith("https://")) {
                // Allow the default anchor behavior for external links
                return; // Do nothing here; let it behave normally
            }

            // Prevent default anchor behavior for internal links
            e.preventDefault();

            // Load the specified page into the main content area if the page attribute is defined
            if (page) {
                $('.content').load(page, function(response, status, xhr) {
                    if (status === "error") {
                        console.log("Error loading page:", xhr.status, xhr.statusText);
                    }
                });
            } else {
                console.log("No page specified in data-page attribute.");
            }
        });
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