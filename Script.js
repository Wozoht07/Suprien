const username = "john"; // Replace with your GitHub username
const projectList = document.getElementById("project-list");

fetch(`https://api.github.com/users/${username}/repos?sort=pushed`)
  .then(response => response.json())
  .then(repos => {
    // Show only top 4 repos for portfolio
    repos.slice(0, 4).forEach(repo => {
      const project = document.createElement("div");
      project.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || "No description available"}</p>
      `;
      projectList.appendChild(project);
    });
  })
  .catch(err => console.error(err));