function loadGalleryPage(pageName) {
    // Pages where images should open in a lightbox
    const lightboxPages = ["graphic-experimentation"];

    // Load the page configuration to get the list of items for the specified gallery page
    $.getJSON("page-config.json", function(pageConfig) {
        var galleryItems = pageConfig[pageName];

        if (!galleryItems) {
            console.log("No content configured for this page.");
            $('.content').html('<p>No items to display.</p>');
            return;
        }

        // Load the graphic content data
        $.getJSON("graphic-content.json", function(graphicContent) {
            var content = '<div class="gallery">'; // Start the gallery container

            // Loop through each item defined in the page configuration
            galleryItems.forEach(function(mapping) {
                var project = graphicContent.find(c => c.projectName === mapping.projectName);
                if (project && project.assets[mapping.assetIndex]) {
                    var asset = project.assets[mapping.assetIndex];
                    var fullImagePath = `/content/${project.projectName}/${asset.image}`;

                    // Determine if the image should open a lightbox or load project-view.html
                    var isLightbox = lightboxPages.includes(pageName);
                    var linkHtml = isLightbox
                        ? `<a href="${fullImagePath}" class="lightbox"><img src="${fullImagePath}" alt="${asset.assetTitle}" /></a>`
                        : `<a href="javascript:void(0);" class="project-link" data-project="${project.projectName}"><img src="${fullImagePath}" alt="${asset.assetTitle}" /></a>`;

                    // Generate the HTML for each gallery item
                    content += `
                        <div class="gallery-item">
                            ${linkHtml}
                        </div>`;
                }
            });

            content += '</div>'; // Close the gallery container

            // Insert the content into the gallery section of the page
            $('.content').html(content);

            // Initialize lightbox if needed
            if (lightboxPages.includes(pageName)) {
                initLightbox();
            }

            // Attach click event to project links
            $('.project-link').on('click', function() {
                var projectName = $(this).data('project');

                // Load project-view.html into the .content area
                $('.content').load('pages/project-view.html', function(response, status, xhr) {
                    if (status == "error") {
                        console.log("Error loading project view:", xhr.status, xhr.statusText);
                    } else {
                        // After loading project-view.html, load the project content
                        loadProjectContent(projectName);
                    }
                });
            });
        });
    });
}