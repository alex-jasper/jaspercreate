function generateImgixUrl(projectName, image, width) {
    return `https://jasper-create.imgix.net/${projectName}/${image}?w=${width}&fit=max&auto=format`;
}

function loadProjectContent(projectName) {
    $.getJSON("graphic-content.json", function(graphicContent) {
        var project = graphicContent.find(c => c.projectName === projectName);

        if (project) {
            var content = `
                <div class="project-view-container">
                    <div class="project-title"><h2>${project.title}</h2></div>
                    <div class="project-client"><p>${project.client}</p></div>
                    <div class="project-description"><p>${project.description}</p></div>
                    <div class="project-assets">
            `;

            project.assets.forEach(function(asset) {
                // Generate Imgix URLs for project view
                var imageUrl = generateImgixUrl(project.projectName, asset.image, 1600); // Large for project
                var lightboxUrl = generateImgixUrl(project.projectName, asset.image, 1600); // Large for lightbox

                content += `
                    <div class="project-asset">
                        <a href="${lightboxUrl}" class="lightbox">
                            <img src="${imageUrl}" alt="${asset.altText}" class="dynamic-image" />
                        </a>
                        <div class="asset-title"><h1>${asset.assetTitle}</h1></div>
                        <div class="asset-description"><p>${asset.description}</p></div>
                    </div>`;
            });

            content += '</div></div><br>';
            $('.content').html(content);
            window.scrollTo(0, 0);
            initLightbox();
        } else {
            $('.content').html('<p>Project not found.</p>');
        }
    });
}