// Récupération des travaux depuis le back-end
// Appel à l’API avec fetch afin de récupérer dynamiquement les projets
// Ajout des travaux à la galerie
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
  } catch (error) {
    console.error("Error fetching categories data:", error.message);
  }
}

function createButtonElement(filter) {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("categories__items");
  buttonElement.id = `project-${filter.id}`;

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
