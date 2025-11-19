const username = "Wozoht07"; // Replace with your GitHub username
const projectList = document.getElementById("project-list");
const MAX_PROJECTS = 6;

// Optional: custom images (fallback to placeholder if missing)
const projectImages = {
  "GA-TSP-Optimizer": "assets/project1.png",
  "SwarmNet-Routing": "assets/project2.png",
  "GradientDescent-Viz": "assets/project3.gif",
  "AWS-CloudData-Pipeline": "assets/project4.png"
};

// Simple cache to avoid hitting rate limit repeatedly
const CACHE_KEY = `github-repos-${username}`;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Show loading state
projectList.innerHTML = `<p class="loading">Loading projects from GitHub...</p>`;

// Helper: create text node safely
function createText(content) {
  return document.createTextNode(content || "No description");
}

async function loadProjects() {
  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        renderProjects(data);
        return;
      }
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=50`);
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error("GitHub rate limit reached. Please try again later.");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Cache the result
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: repos,
      timestamp: Date.now()
    }));

    renderProjects(repos);
  } catch (err) {
    console.error(err);
    projectList.innerHTML = `
      <p class="error">
        Could not load projects: ${err.message}<br><br>
        <small>Check your GitHub username or try again later.</small>
      </p>`;
  }
}

function renderProjects(repos) {
  projectList.innerHTML = ""; // Clear loading

  if (!repos || repos.length === 0) {
    projectList.innerHTML = "<p>No public repositories found.</p>";
    return;
  }

  repos
    .filter(repo => !repo.fork && !repo.private) // Optional: hide forks/private
    .slice(0, MAX_PROJECTS)
    .forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";

      const imgSrc = projectImages[repo.name] || `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `${repo.name} preview`;
      img.loading = "lazy";
      img.onerror = () => img.style.display = "none"; // Hide broken images

      const title = document.createElement("h3");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name.replace(/-/g, " ").replace(/_/g, " ");
      title.appendChild(link);

      const desc = document.createElement("p");
      desc.appendChild(createText(repo.description));

      const tech = document.createElement("p");
      tech.innerHTML = `<strong>Tech:</strong> ${repo.language || "Various"} ${
        repo.topics?.length > 0 ? " · " + repo.topics.slice(0, 3).join(" · ") : ""
      }`;

      // Append all safely
      if (projectImages[repo.name]) card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(tech);

      projectList.appendChild(card);
    });
}

// Run on load
document.addEventListener("DOMContentLoaded", loadProjects);
