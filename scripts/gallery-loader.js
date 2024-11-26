function loadGalleryPage(pageName) {
    const lightboxPages = ["graphic-experimentation", "event-posters", "music-cover-art"]; // Pages that open lightbox

    $.getJSON("page-config.json", function (pageConfig) {
        const galleryItems = pageConfig[pageName];

        if (!galleryItems) {
            console.log("No content configured for this page.");
            $('.content').html('<p>No items to display.</p>');
            return;
        }

        $.getJSON("graphic-content.json", function (graphicContent) {
            let content = '<div class="gallery">';

            galleryItems.forEach((mapping) => {
                const project = graphicContent.find(
                    (c) => c.projectName === mapping.projectName
                );

                if (project && project.assets[mapping.assetIndex]) {
                    const asset = project.assets[mapping.assetIndex];
                    const imageUrl = generateImgixUrl(
                        project.projectName,
                        asset.image,
                        800 // Medium for gallery view
                    );

                    // Simplified: All images open in lightbox by default
                    const linkHtml = project.featured
                        ? `<a href="javascript:void(0);" class="project-link" data-project-name="${project.projectName}">
                            <img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image gallery-image" />
                        </a>`
                        : `<a href="${generateImgixUrl(project.projectName, asset.image)}" class="lightbox">
                            <img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image gallery-image" />
                        </a>`;

                    content += `
                        <div class="gallery-item">
                            ${linkHtml}
                        </div>`;
                }
            });

            content += '</div>';
            $('.content').html(content);

            // Initialize lightbox for all images
            if (lightboxPages.includes(pageName) && typeof initLightbox === 'function') {
                initLightbox();
            }

            // Add placeholders for images
            addPlaceholders();
        });
    });
}

// Attach click handler for dynamically loaded project links
$(document).on('click', '.project-link', function () {
    const projectName = $(this).data('project-name');
    if (projectName) {
        loadProject(projectName);
    }
});

// Load a specific project
function loadProject(projectName) {
    $('.content').load('pages/project-view.html', function (response, status, xhr) {
        if (status === "error") {
            console.log("Error loading project view:", xhr.status, xhr.statusText);
        } else if (typeof loadProjectContent === 'function') {
            loadProjectContent(projectName); // Populate project content
        }
    });
}

function loadProjectContent(projectName) {
    $.getJSON("graphic-content.json", function (graphicContent) {
        const project = graphicContent.find(c => c.projectName === projectName);

        if (project) {
            let content = `
                <div class="project-view-container">
                    <div class="project-title"><h2>${project.title}</h2></div>
                    <div class="project-client"><p>${project.client}</p></div>
                    <div class="project-description"><p>${project.description}</p></div>
                    <div class="project-assets">
            `;

            project.assets.forEach(asset => {
                const imageUrl = generateImgixUrl(project.projectName, asset.image, 1600); // Large for project view
                const lightboxUrl = generateImgixUrl(project.projectName, asset.image, 1600); // Large for lightbox

                content += `
                    <div class="project-asset">
                        <a href="${lightboxUrl}" class="lightbox">
                            <img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image" />
                        </a>
                        <div class="asset-title"><h1>${asset.assetTitle}</h1></div>
                        <div class="asset-description"><p>${asset.description}</p></div>
                    </div>`;
            });

            content += '</div></div>';
            $('.content').html(content);
            initLightbox(); // Reinitialize lightbox for loaded content
            addPlaceholders(); // Add placeholders for images
        } else {
            $('.content').html('<p>Project not found.</p>');
        }
    });
}

function addPlaceholders() {
    const images = document.querySelectorAll('img.dynamic-image');

    images.forEach(image => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-container';

        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';

        // Insert the wrapper and move the image inside it
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(placeholder);
        wrapper.appendChild(image);

        // Handle image load
        image.addEventListener('load', () => {
            setTimeout(() => {
                image.classList.add('loaded');
                placeholder.remove();
            }, 100); // Optional delay for smooth transition
        });

        // Handle cached images
        if (image.complete) {
            image.dispatchEvent(new Event('load'));
        }
    });
}