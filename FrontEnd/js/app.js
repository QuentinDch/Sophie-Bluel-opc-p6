// Script pour récupérer et afficher dynamiquement les projets dans la galerie.
// Utilise l'API pour obtenir les données des projets et les affiche à l'aide d'éléments HTML dans la page.
async function fetchGalleryData() {
  const worksApiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(worksApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const galleryData = await response.json();
    console.log(galleryData);

    const galleryDivElement = document.querySelector(".gallery");

    galleryData.forEach((project) => {
      const worksFigElement = createGalleryElement(project);
      galleryDivElement.appendChild(worksFigElement);
    });
  } catch (error) {
    console.error("Error fetching gallery data:", error.message);
  }
}

/**
 * Crée l'élément HTML "figure", pour afficher un projet dans la galerie.
 *
 * @param {Object} project - Le paramètre 'project' est un objet représentant le projet.
 * @param {number} project.id - L'identifiant unique du projet.
 * @param {string} project.imageUrl - L'URL de l'image du projet.
 * @param {string} project.title - Le titre du projet.
 * @returns {HTMLElement} L'élément HTML "figure" contenant l'image et le titre du projet.
 */

function createGalleryElement(project) {
  const worksFigElement = document.createElement("figure");
  worksFigElement.id = `project-${project.id}`;

  const worksImgElement = document.createElement("img");
  worksImgElement.src = project.imageUrl;
  worksImgElement.alt = project.title;
  worksImgElement.loading = "lazy";

  const worksFigcaptionElement = document.createElement("figcaption");
  worksFigcaptionElement.textContent = project.title;

  worksFigElement.append(worksImgElement, worksFigcaptionElement);

  return worksFigElement;
}

fetchGalleryData();

// Réalisation du filtre des travaux : Ajout des filtres pour afficher les travaux par catégorie
async function fetchCategoriesGalleryData() {
  const categoriesGalleryUrl = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(categoriesGalleryUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categoriesData = await response.json();
    console.log(categoriesData);

    const categoriesDivElement = document.querySelector(".categories");

    categoriesData.forEach((filter) => {
      const filterButton = createButtonElement(filter);
      categoriesDivElement.appendChild(filterButton);
    });

    // Appelle la fonction pour configurer les filtres après la création et ajout au DOM des boutons
    setupCategoryFilters();
  } catch (error) {
    console.error("Error fetching categories data:", error.message);
  }
}

function createButtonElement(filter) {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("categories__items");
  buttonElement.id = filter.id;

  buttonElement.setAttribute("aria-pressed", "false");
  buttonElement.setAttribute(
    "aria-label",
    `Afficher les éléments pour ${filter.name}`
  );

  const spanElement = document.createElement("span");
  spanElement.textContent = filter.name;

  buttonElement.appendChild(spanElement);

  return buttonElement;
}

fetchCategoriesGalleryData();

// Configure les boutons de catégorie
function setupCategoryFilters() {
  const buttons = document.querySelectorAll(".categories__items");
  console.log(buttons);
  const gallery = document.querySelector(".gallery");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Mise à jour de l'état actif et de l'aria
      buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("active");
      });
      button.setAttribute("aria-pressed", "true");
      button.classList.add("active");

      const btnId = button.id;
      console.log(btnId);
      gallery.innerHTML = " ";
    });
  });
}
