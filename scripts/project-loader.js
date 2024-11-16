function generateImgixUrl(projectName, image, width = null) {
    let url = `https://jasper-create.imgix.net/${projectName}/${image}?fit=max&auto=format`;
    if (width) url += `&w=${width}`;
    return url;
}

function loadPage(htmlFile) {
    // Load the specified HTML file into the .content area
    $('.content').load(`pages/${htmlFile}.html`, function (response, status, xhr) {
        if (status === "error") {
            console.error(`Error loading ${htmlFile}:`, xhr.status, xhr.statusText);
            $('.content').html('<p>Error loading content. Please try again later.</p>'); // Display error message in the content area
        } else {
            console.log(`${htmlFile} loaded successfully.`);
        }
    });
}

function loadProjectContent(projectName) {
    $.getJSON("graphic-content.json", function (graphicContent) {
        const project = graphicContent.find((c) => c.projectName === projectName);

        if (project) {
            let content = `
                <div class="project-view-container">
                    <div class="project-title"><h2>${project.title}</h2></div>
                    <div class="project-client"><p>${project.client}</p></div>
                    <div class="project-description"><p>${project.description}</p></div>
                    <div class="project-assets">
            `;

            project.assets.forEach((asset) => {
                const imageUrl = generateImgixUrl(project.projectName, asset.image, 800); // Medium size for display
                const lightboxUrl = generateImgixUrl(project.projectName, asset.image); // High-res for lightbox

                // Add each project asset with a lightbox link
                content += `
                    <div class="project-asset">
                        <a href="${lightboxUrl}" class="lightbox"> <!-- Correct lightbox URL -->
                            <img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image" />
                        </a>
                        <div class="asset-title"><h1>${asset.assetTitle}</h1></div>
                        <div class="asset-description"><p>${asset.description}</p></div>
                    </div>`;
            });

            content += '</div></div>';
            $('.content').html(content);

            // Reinitialize lightbox for newly added content
            initLightbox();
        } else {
            $('.content').html('<p>Project not found.</p>');
        }
    });
}