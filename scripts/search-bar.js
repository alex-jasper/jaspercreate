let projects = [];

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('graphic-content.json');
        projects = await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Function to load a random project
function loadRandomProject() {
    if (projects.length === 0) {
        console.error('No projects available to load.');
        return;
    }

    // Pick a random project
    const randomIndex = Math.floor(Math.random() * projects.length);
    const randomProject = projects[randomIndex];

    if (randomProject && randomProject.projectName) {
        loadProject(randomProject.projectName);
    } else {
        console.error('Invalid project data.');
    }
}

// Display projects in search results
function displayProjects(filteredProjects) {
    const projectContainer = document.getElementById('projectContainer');
    const searchResults = document.getElementById('searchResults');
    projectContainer.innerHTML = ''; // Clear previous results

    if (filteredProjects.length > 0) {
        searchResults.style.display = 'block'; // Show results
        filteredProjects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project');
            projectDiv.dataset.projectName = project.projectName; // Add project name for loading
            projectDiv.innerHTML = `<h3>${project.title}</h3>`;
            projectContainer.appendChild(projectDiv);
        });
    } else {
        searchResults.style.display = 'none'; // Hide if no matches
    }
}

// Filter projects based on input
function searchProjects() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        document.getElementById('searchResults').style.display = 'none';
        return;
    }

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.client.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
    );

    displayProjects(filteredProjects);
}

// Load project details when a search result is clicked
function setupProjectClickHandler() {
    const projectContainer = document.getElementById('projectContainer');

    // Use event delegation for dynamically loaded elements
    projectContainer.addEventListener('click', (event) => {
        const projectDiv = event.target.closest('.project'); // Ensure correct element is targeted
        if (projectDiv) {
            const projectName = projectDiv.dataset.projectName;
            if (projectName) {
                console.log('Clicked on project:', projectName);
                loadProject(projectName); // Call the project loader function
            } else {
                console.error('Project name not found in dataset.');
            }
        } else {
            console.error('Click event did not target a valid .project element.');
        }
    });
}

// Function to load a project dynamically
function loadProject(projectName) {
    console.log(`Attempting to load project: ${projectName}`);

    // Dynamically load project view page
    const contentContainer = document.querySelector('.content');
    if (!contentContainer) {
        console.error('Content container not found!');
        return;
    }

    fetch('pages/project-view.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load project view page: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentContainer.innerHTML = html; // Insert project view HTML
            loadProjectContent(projectName); // Call your existing function to populate the project data
        })
        .catch(error => {
            console.error('Error loading project view page:', error);
        });
}

// Handle showing/hiding search results
function setupSearchInteraction() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Show results when input is focused
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            searchResults.style.display = 'block';
        }
    });

    // Hide results when clicking outside the input and results
    document.addEventListener('click', (event) => {
        if (
            !searchInput.contains(event.target) &&
            !searchResults.contains(event.target)
        ) {
            searchResults.style.display = 'none';
        }
    });

    // Update results as user types
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() !== '') {
            searchResults.style.display = 'block';
            searchProjects();
        } else {
            searchResults.style.display = 'none';
        }
    });
}

// Initialize the search functionality
window.onload = async function () {
    await loadProjects(); // Load project data
    setupSearchInteraction(); // Set up interactions for the search bar
    setupProjectClickHandler(); // Set up click handling for search results
    const randomButton = document.getElementById('randomProjectButton');
    randomButton.addEventListener('click', loadRandomProject);
};