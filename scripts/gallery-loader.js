function loadGalleryPage(pageName) {
    const lightboxPages = ["graphic-experimentation"];

    // Load page configuration to determine what content to display
    $.getJSON("page-config.json")
        .done(function(pageConfig) {
            var galleryItems = pageConfig[pageName];

            if (!galleryItems) {
                console.error(`No content configured for page: ${pageName}`);
                $('.content').html('<p>No items to display.</p>');
                return;
            }

            // Load graphic content
            $.getJSON("graphic-content.json")
                .done(function(graphicContent) {
                    var content = '<div class="gallery">';

                    // Loop through items defined in page-config.json
                    galleryItems.forEach(function(mapping) {
                        var project = graphicContent.find(c => c.projectName === mapping.projectName);
                        if (project && project.assets[mapping.assetIndex]) {
                            var asset = project.assets[mapping.assetIndex];

                            // Generate Imgix URLs
                            var imageUrl = generateImgixUrl(project.projectName, asset.image, 800); // Medium for gallery
                            var lightboxUrl = generateImgixUrl(project.projectName, asset.image, 1600); // Large for lightbox

                            // Gallery items with lightbox or project link
                            var isLightbox = lightboxPages.includes(pageName);
                            var linkHtml = isLightbox
                                ? `<a href="${lightboxUrl}" class="lightbox"><img src="${imageUrl}" alt="${asset.altText}" /></a>`
                                : `<a href="javascript:void(0);" class="project-link" data-project="${project.projectName}"><img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image"/></a>`;

                            content += `<div class="gallery-item">${linkHtml}</div>`;
                        }
                    });

                    content += '</div>';
                    $('.content').html(content);

                    addPlaceholders();

                    // Initialize lightbox if applicable
                    if (lightboxPages.includes(pageName) && typeof initLightbox === 'function') {
                        initLightbox();
                    }
                })
                .fail(function() {
                    console.error("Error loading graphic-content.json");
                    $('.content').html('<p>Error loading content data.</p>');
                });
        })
        .fail(function() {
            console.error("Error loading page-config.json");
            $('.content').html('<p>Error loading page configuration.</p>');
        });
}

// Attach click event to dynamically loaded project links
$(document).on('click', '.project-link', function() {
    var projectName = $(this).data('project');

    // Load project-view.html into the .content area
    $('.content').load('pages/project-view.html', function(response, status, xhr) {
        if (status === "error") {
            console.log("Error loading project view:", xhr.status, xhr.statusText);
        } else if (typeof loadProjectContent === 'function') {
            // After loading project-view.html, load the project content
            loadProjectContent(projectName);
        }
    });
});

function loadPage(htmlFile) {
    // Load the specified HTML file into the .content area
    $('.content').load(`pages/${htmlFile}.html`, function(response, status, xhr) {
        if (status === "error") {
            console.log(`Error loading ${htmlFile}:`, xhr.status, xhr.statusText);
            $('.content').html('<p>Error loading content.</p>'); // Display error message in the content area
        } else {
            console.log(`${htmlFile} loaded successfully.`);
        }
    });
}

function addPlaceholders() {
    const images = document.querySelectorAll('img.dynamic-image');

    images.forEach(image => {
        // Create a wrapper for the image
        const wrapper = document.createElement('div');
        wrapper.className = 'image-container';

        // Create a placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';

        // Insert the wrapper and move the image inside it
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(placeholder);
        wrapper.appendChild(image);

        // Listen for the image load event
        image.addEventListener('load', () => {
            // Add a slight delay before removing the placeholder (optional for smoother transition)
            setTimeout(() => {
                image.classList.add('loaded');
                placeholder.remove();
            }, 100); // 100ms delay for smoother effect
        });

        // If the image is already loaded (cached), trigger the load event manually
        if (image.complete) {
            image.dispatchEvent(new Event('load'));
        }
    });
}