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

// Initialize search functionality
window.onload = function() {
    loadProjects();

    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const projectContainer = document.getElementById('projectContainer');

    // Show results when input is focused if it has content
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            searchResults.style.display = 'block';
            searchProjects();
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

    // Show results again when clicking back into input
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() !== '') {
            searchResults.style.display = 'block';
            searchProjects();
        } else {
            searchResults.style.display = 'none';
        }
    });
};