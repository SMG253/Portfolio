// Projects page: render cards from data, search + filter, detail modal.

// 1. Data: every project is an object { id, title, description, tech, year, link }
const projects = [
  {
    id: 1,
    title: "Responsive Portfolio",
    description: "This website: a three-page portfolio built mobile-first with semantic HTML, CSS custom properties, a dark mode toggle and JavaScript-rendered project cards.",
    tech: ["HTML", "CSS", "JavaScript"],
    year: 2026,
    link: "https://github.com/SMG253/Portfolio"
  },
  {
    id: 2,
    title: "Forensic AI Crime Solver",
    description: "An interactive crime investigation workbench that models forensic reasoning as a state-space search (DFS, BFS, A*) with a propositional logic interrogation engine, as a web app and a Python CLI.",
    tech: ["JavaScript", "Python", "HTML", "CSS", "AI"],
    year: 2026,
    link: "https://github.com/SMG253/Forensic-AI-Crime-Solver"
  },
  {
    id: 3,
    title: "Hangman Game",
    description: "A digital Hangman game with multiple difficulty levels and AI hints on the hard level. Words are picked from a dictionary by a Flask backend.",
    tech: ["Python", "Flask", "JavaScript", "HTML", "CSS"],
    year: 2026,
    link: "https://github.com/SMG253/hangman-game"
  },
  {
    id: 4,
    title: "Mobile Price Prediction",
    description: "An end-to-end machine learning pipeline that predicts smartphone prices from hardware specs and brand, using Random Forest Regression, with EDA and feature engineering.",
    tech: ["Python", "Machine Learning", "scikit-learn", "Pandas"],
    year: 2026,
    link: "https://github.com/SMG253/ML-project-complete-pipeline"
  },
  {
    id: 5,
    title: "Used Car Prices EDA",
    description: "Exploratory data analysis of a used car dataset to find what drives prices, followed by tree-based models to predict them.",
    tech: ["Python", "Pandas", "scikit-learn", "Machine Learning"],
    year: 2026,
    link: "https://github.com/SMG253/used-cars-prices-EDA"
  },
  {
    id: 6,
    title: "Google Maps Scraper",
    description: "Collects business details from Google Maps as an alternative to the paid API. Selenium does the scraping, FastAPI serves the results and they can be exported to Excel.",
    tech: ["Python", "Selenium", "FastAPI", "Pandas"],
    year: 2025,
    link: "https://github.com/SMG253/Google-map-scraping"
  }
];

// 2. References to elements on the page
const grid = document.getElementById("project-grid");
const searchInput = document.getElementById("search");
const techSelect = document.getElementById("tech-filter");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const filterForm = document.getElementById("filter-form");

const dialog = document.getElementById("project-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogYear = document.getElementById("dialog-year");
const dialogDescription = document.getElementById("dialog-description");
const dialogTech = document.getElementById("dialog-tech");
const dialogLink = document.getElementById("dialog-link");
const dialogClose = document.getElementById("dialog-close");

// 3. Fill the <select> with every technology used, sorted A-Z, no duplicates
function populateTechOptions() {
  const allTech = projects.flatMap((project) => project.tech);
  const uniqueTech = [...new Set(allTech)].sort();

  uniqueTech.forEach((tech) => {
    const option = document.createElement("option");
    option.value = tech;
    option.textContent = tech;
    techSelect.appendChild(option);
  });
}

// Builds a <ul> of tech tags (used by cards and the modal)
function createTagItems(list, techArray) {
  techArray.forEach((tech) => {
    const li = document.createElement("li");
    li.className = "tag";
    li.textContent = tech;
    list.appendChild(li);
  });
}

// 4. Create one project card using DOM methods only (no innerHTML)
function createCard(project) {
  const li = document.createElement("li");

  const article = document.createElement("article");
  article.className = "project-card";

  const title = document.createElement("h2");
  title.textContent = project.title;

  const year = document.createElement("p");
  year.className = "project-year";
  year.textContent = String(project.year);

  const description = document.createElement("p");
  description.textContent = project.description;

  const tags = document.createElement("ul");
  tags.className = "tag-list";
  tags.setAttribute("aria-label", "Technologies used");
  createTagItems(tags, project.tech);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const detailsButton = document.createElement("button");
  detailsButton.type = "button";
  detailsButton.className = "btn";
  detailsButton.textContent = "Details";
  detailsButton.setAttribute("aria-label", `Details about ${project.title}`);
  detailsButton.addEventListener("click", () => openDialog(project));

  const codeLink = document.createElement("a");
  codeLink.className = "btn btn-outline";
  codeLink.href = project.link;
  codeLink.target = "_blank";
  codeLink.rel = "noopener";
  codeLink.textContent = "Code";
  codeLink.setAttribute("aria-label", `Source code for ${project.title} (opens in a new tab)`);

  actions.append(detailsButton, codeLink);
  article.append(title, year, description, tags, actions);
  li.appendChild(article);
  return li;
}

// 5. Combined filter: search text (title or tech) AND the selected technology
function getFilteredProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedTech = techSelect.value;

  return projects.filter((project) => {
    const matchesSearch =
      query === "" ||
      project.title.toLowerCase().includes(query) ||
      project.tech.some((tech) => tech.toLowerCase().includes(query));

    const matchesTech = selectedTech === "all" || project.tech.includes(selectedTech);

    return matchesSearch && matchesTech;
  });
}

// 6. Draw the cards, update the live count and the empty state
function renderProjects() {
  const filtered = getFilteredProjects();

  grid.replaceChildren(); // remove old cards safely
  filtered.forEach((project) => grid.appendChild(createCard(project)));

  resultCount.textContent = `Showing ${filtered.length} of ${projects.length} projects`;

  emptyState.hidden = filtered.length > 0;
}

// 7. Project detail modal using the native <dialog> element (bonus)
function openDialog(project) {
  dialogTitle.textContent = project.title;
  dialogYear.textContent = String(project.year);
  dialogDescription.textContent = project.description;
  dialogTech.replaceChildren();
  createTagItems(dialogTech, project.tech);
  dialogLink.href = project.link;
  dialog.showModal(); // traps focus and closes with Esc automatically
}

dialogClose.addEventListener("click", () => dialog.close());

// Close the modal when the user clicks on the dark backdrop
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

// 8. Event listeners
searchInput.addEventListener("input", renderProjects);
techSelect.addEventListener("change", renderProjects);
filterForm.addEventListener("submit", (event) => event.preventDefault()); // Enter key should not reload

// 9. Start
populateTechOptions();
renderProjects();
