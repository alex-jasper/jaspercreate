// Function to load project content in project-view.html
// Function to load project content in project-view.html
function loadProjectContent(projectName) {
    // Load the project data from the JSON file
    $.getJSON("graphic-content.json", function(graphicContent) {
        var project = graphicContent.find(c => c.projectName === projectName);

        if (project) {
            // Populate the project page with the project details
            var content = `
                <div class="project-view-container">
                    <div class="project-title"><h2>${project.title}</h2></div>
                    <div class="project-client"><p>${project.client}</p></div>
                    <div class="project-description"><p>${project.description}</p></div>
                    <div class="project-assets">
                    `;

            // Loop through each asset for this project
            project.assets.forEach(function(asset) {
                var fullImagePath = `/content/${project.projectName}/${asset.image}`;

                content += `
                    <div class="project-asset">
                    <a href="${fullImagePath}" class="lightbox">
                    <img src="${fullImagePath}" alt="${asset.altText}" />
                    </a>
                    <div class="asset-title"><h1>${asset.assetTitle}</h1></div>
                    <div class="asset-description"><p>${asset.description}</p></div>
                    </div>`;
            });

            content += '</div></div><br>'; // Close the .project-assets and .project-view-container

            // Insert the content into the .content area
            $('.content').html(content); // Replace content with the project details

            // Reset scroll to the top of the page
            window.scrollTo(0, 0);

            // Initialize lightbox for project images
            initLightbox();
        } else {
            $('.content').html('<p>Project not found.</p>');
        }
    });
}