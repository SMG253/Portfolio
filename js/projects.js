// Projects page: render cards from data, search + filter, detail modal.

// 1. Data: every project is an object { id, title, description, tech, year, link }
const projects = [
  {
    id: 1,
    title: "Responsive Portfolio",
    description: "This website: a three-page portfolio built mobile-first with semantic HTML, CSS custom properties and a dark mode toggle.",
    tech: ["HTML", "CSS", "JavaScript"],
    year: 2026,
    link: "https://github.com/"
  },
  {
    id: 2,
    title: "Weather Dashboard",
    description: "Shows the current weather and a 5-day forecast for any city using the Fetch API and a public weather API.",
    tech: ["JavaScript", "Fetch API", "CSS Grid"],
    year: 2026,
    link: "https://github.com/"
  },
  {
    id: 3,
    title: "Task Manager",
    description: "A to-do app with add, edit, delete and filter features. Tasks are saved in localStorage so they survive a page reload.",
    tech: ["JavaScript", "localStorage", "CSS"],
    year: 2025,
    link: "https://github.com/"
  },
  {
    id: 4,
    title: "Restaurant Landing Page",
    description: "A single-page restaurant site with a Flexbox menu layout, smooth scrolling and an accessible reservation form.",
    tech: ["HTML", "CSS", "Flexbox"],
    year: 2025,
    link: "https://github.com/"
  },
  {
    id: 5,
    title: "Quiz Game",
    description: "A timed multiple-choice quiz that tracks the score, shows correct answers and stores the high score.",
    tech: ["JavaScript", "HTML", "CSS"],
    year: 2025,
    link: "https://github.com/"
  },
  {
    id: 6,
    title: "Photo Gallery",
    description: "A responsive image gallery built with CSS Grid, lazy-loaded images and a keyboard-friendly lightbox.",
    tech: ["CSS Grid", "JavaScript", "HTML"],
    year: 2024,
    link: "https://github.com/"
  },
  {
    id: 7,
    title: "Expense Tracker",
    description: "Records income and expenses, shows the balance and groups spending by category.",
    tech: ["JavaScript", "localStorage", "CSS Grid"],
    year: 2024,
    link: "https://github.com/"
  },
  {
    id: 8,
    title: "Markdown Previewer",
    description: "Type Markdown on the left and see the formatted result on the right, updated as you type.",
    tech: ["JavaScript", "HTML", "Flexbox"],
    year: 2024,
    link: "https://github.com/"
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
