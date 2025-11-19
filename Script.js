const username = "john"; // Replace with your GitHub username
const projectList = document.getElementById("project-list");

// Map of repo names to optional images (replace filenames with your assets)
const projectImages = {
  "GA-TSP-Optimizer": "assets/project1.png",
  "SwarmNet-Routing": "assets/project2.png",
  "GradientDescent-Viz": "assets/project3.gif",
  "AWS-CloudData-Pipeline": "assets/project4.png"
};

fetch(`https://api.github.com/users/${Wozoht07}/suprien?sort=pushed`)
  .then(response => response.json())
  .then(repos => {
    // Optional: show top 4-6 repos
    repos.slice(0, 6).forEach(repo => {
      const project = document.createElement("div");
      project.className = "project-card";

      const imgTag = projectImages[repo.name] ? 
        `<img src="${projectImages[repo.name]}" alt="${repo.name} demo">` : "";

      project.innerHTML = `
        ${imgTag}
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || "No description available"}</p>
        <p><strong>Tech:</strong> Python · ML · AI</p>
      `;
      projectList.appendChild(project);
    });
  })
  .catch(err => console.error(err));
