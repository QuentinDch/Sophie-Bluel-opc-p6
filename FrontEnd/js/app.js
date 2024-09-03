let galleryData = []; // Variable globale pour stocker les données des projets
// Script pour récupérer et afficher dynamiquement les projets dans la galerie.
// Utilise l'API pour obtenir les données des projets et les affiche à l'aide d'éléments HTML dans la page.
async function fetchGalleryData() {
  const worksApiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(worksApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    galleryData = await response.json(); // Stocke les données dans la variable globale
    console.log(galleryData);

    displayProjects(galleryData); // Affiche tous les projets par défaut
  } catch (error) {
    console.error("Error fetching gallery data:", error.message);
  }
}
fetchGalleryData();

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
  const galleryDivElement = document.querySelector(".gallery");
  galleryDivElement.innerHTML = ""; // Efface le contenu existant

  projects.forEach((project) => {
    const worksFigElement = createGalleryElement(project);
    galleryDivElement.appendChild(worksFigElement);
  });
}

// Crée l'élément HTML "figure" pour afficher un projet dans la galerie
function createGalleryElement(project) {
  const worksFigElement = document.createElement("figure");
  worksFigElement.id = project.id;

  const worksImgElement = document.createElement("img");
  worksImgElement.src = project.imageUrl;
  worksImgElement.alt = project.title;
  worksImgElement.loading = "lazy";

  const worksFigcaptionElement = document.createElement("figcaption");
  worksFigcaptionElement.textContent = project.title;

  worksFigElement.append(worksImgElement, worksFigcaptionElement);

  return worksFigElement;
}

// Récupère et affiche les catégories pour les filtres
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
fetchCategoriesGalleryData();

// Crée un élément bouton pour chaque catégorie
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

// Configure les boutons de catégorie
function setupCategoryFilters() {
  const buttons = document.querySelectorAll(".categories__items");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Mise à jour de l'état actif et de l'aria
      buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("active");
      });
      button.setAttribute("aria-pressed", "true");
      button.classList.add("active");

      const btnId = parseInt(button.id, 10); // Convertir l'ID en nombre et plus en string
      console.log(btnId);

      if (btnId === 0) {
        displayProjects(galleryData);
      } else {
        const filteredProjects = galleryData.filter(
          (project) => project.categoryId === btnId
        );
        displayProjects(filteredProjects);
      }
    });
  });
}

// Fonction d'authentification de connexion
function TokenVerification() {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    console.log("Utilisateur authentifié avec un token.");
    const bannerEditElement = document.querySelector(".banner-edit");
    const btnLog = document.getElementById("btnLog");

    if (bannerEditElement) {
      bannerEditElement.style.clipPath = "inset(0 0 0 0)";

      btnLog.textContent = "logout";
      btnLog.addEventListener("click", () => {
        sessionStorage.removeItem("authToken");
      });

      document.getElementById("portfolio").innerHTML += `
      <div class="btn-container">
        <button type="button"><span>modifier</span></button>
      </div>
      `;
      return;
    }
  }
  console.log("Utilisateur non authentifié. Aucun token trouvé.");
}
TokenVerification();
