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

    // Appelle la fonction pour ajouter les catégories dans le select
    populateCategorySelect(categoriesData);

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
    const portfolio = document.getElementById("portfolio");

    if (bannerEditElement) {
      bannerEditElement.style.clipPath = "inset(0 0 0 0)";

      btnLog.textContent = "logout";
      btnLog.addEventListener("click", () => {
        sessionStorage.removeItem("authToken");
      });

      // Création et ajout du bouton "modifier"
      const btnContainer = createEditButton();
      portfolio.appendChild(btnContainer);

      return;
    }
  }
  console.log("Utilisateur non authentifié. Aucun token trouvé.");
}
TokenVerification();

// Fonction de création et d'interaction du bouton de la modale
function createEditButton() {
  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  const button = document.createElement("button");
  button.type = "button";

  const span = document.createElement("span");
  span.textContent = "modifier";

  button.appendChild(span);
  btnContainer.appendChild(button);

  button.addEventListener("click", openModal);

  return btnContainer;
}

function openModal() {
  const modalElement = document.getElementById("modal");
  const modalContent = modalElement.querySelector("#homepage-edit1");

  modalElement.style.display = null;
  modalElement.setAttribute("aria-hidden", "false");

  modalContent.addEventListener("click", (event) => event.stopPropagation());

  // Ajout des listeners de fermeture
  addCloseModalListeners(modalElement);

  // Ajout du listener pour le bouton d'ajout d'image
  addAddPictureListener();
}

function addCloseModalListeners(modalElement) {
  const btnClosedModal = document.getElementById("btn-closed-modal");

  // Fermeture via le bouton de fermeture
  btnClosedModal.addEventListener("click", () => closeModal(modalElement));

  displayProjectsModal(galleryData);

  // Fermeture via le clic sur l'overlay
  modalElement.addEventListener("click", () => closeModal(modalElement));
}

function closeModal(modalElement) {
  modalElement.style.display = "none";
  modalElement.setAttribute("aria-hidden", "true");
}

function displayProjectsModal(projects) {
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  galleryWrapper.innerHTML = "";

  projects.forEach((project) => {
    const figureModalElement = createGalleryModalElement(project);
    galleryWrapper.appendChild(figureModalElement);
  });
}

function createGalleryModalElement(project) {
  const figureModalElement = document.createElement("figure");
  figureModalElement.id = project.id;

  const imgModalElement = document.createElement("img");
  imgModalElement.src = project.imageUrl;
  imgModalElement.alt = project.title;
  imgModalElement.loading = "lazy";

  const buttonModalElement = document.createElement("button");
  buttonModalElement.id = "deleteBtn";
  buttonModalElement.type = "button";
  buttonModalElement.ariaLabel = "Supprimer un projet";

  figureModalElement.appendChild(imgModalElement);
  figureModalElement.appendChild(buttonModalElement);

  // Ajout de l'écouteur d'event pour supprimer un projet
  buttonModalElement.addEventListener("click", () => {
    openDeleteModal(project.id, figureModalElement);
  });

  return figureModalElement;
}

function addAddPictureListener() {
  const btnAddPicture = document.getElementById("btn-add-picture");
  btnAddPicture.addEventListener("click", () => {
    const homepageEdit2 = document.getElementById("homepage-edit2");
    const btnPrevModal = document.getElementById("btn-prev-modal");
    homepageEdit2.style.clipPath = "inset(0 0 0 0)";
    btnPrevModal.style.opacity = "1";
    btnPrevModal.addEventListener("click", () => {
      homepageEdit2.style.clipPath = "inset(0 0 100% 0)";
      btnPrevModal.style.opacity = "0";
    });
  });
}

// Fonction qui ouvre la modale et gère les boutons de confirmation et d'annulation
function openDeleteModal(projectId, figureElement) {
  const modal = document.getElementById("modal-delete");
  const overlay = document.getElementById("modal-overlay");

  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden", "false");

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");

  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  cancelDeleteBtn.addEventListener("click", () => closeDeleteModal());

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", () => {
    deleteProject(figureElement, projectId);
    closeDeleteModal();
  });
}

function closeDeleteModal() {
  const modal = document.getElementById("modal-delete");
  const overlay = document.getElementById("modal-overlay");

  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden", "true");

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// Fonction pour supprimer un projet
let authToken = sessionStorage.getItem("authToken");

function deleteProject(figureElement, projectId) {
  figureElement.remove();
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Erreur lors de la suppression du projet");
      return;
    }

    console.log(`Projet ${projectId} supprimé du serveur`);
    galleryData = galleryData.filter((project) => project.id !== projectId);
    displayProjects(galleryData); // Mets à jour l'affichage de la galerie
  });
}

// Fonction pour ajouter les catégories au select
function populateCategorySelect(categories) {
  const selectElement = document.getElementById("category");

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "";
  defaultOption.value = "";
  selectElement.appendChild(defaultOption);

  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    selectElement.appendChild(optionElement);
  });
}

// Déclenche le clic sur l'input file
document.getElementById("uploadButton").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// Aperçu du fichier image sélectionné
const inputFile = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

// Ecouter les changements de l'input file
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const previewWrapper = document.createElement("div");
      previewWrapper.classList.add("image-preview-wrapper");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Aperçu de l'image téléchargée";

      previewWrapper.appendChild(img);

      // Ajout du bouton "changer de photo"
      const changeButton = document.createElement("button");
      changeButton.classList.add("change-btn");
      changeButton.type = "button";
      changeButton.title = "Modifier le fichier téléchargé";
      previewWrapper.appendChild(changeButton);

      // Insère le conteneur d'image après le bouton d'upload
      uploadButton.parentNode.insertBefore(
        previewWrapper,
        uploadButton.nextSibling
      );

      // Cache la div et ses éléments après la prévisualisation
      const iconWrapper = document.querySelector(".icon-wrapper");
      if (iconWrapper) {
        iconWrapper.style.display = "none";
      }

      // Cache le button dans le formulaire
      if (uploadButton) {
        uploadButton.style.display = "none";
      }

      // Cache les spans dans le formulaire
      const formSpans = document.querySelectorAll(".form-upload span");
      formSpans.forEach((span) => {
        span.style.display = "none";
      });

      // Gestion du clic sur "Changer de photo"
      changeButton.addEventListener("click", () => {
        previewWrapper.remove();
        inputFile.value = "";

        // Réaffiche les éléments cachés
        if (iconWrapper) {
          iconWrapper.style.display = "block";
        }
        if (uploadButton) {
          uploadButton.style.display = "block";
        }
        formSpans.forEach((span) => {
          span.style.display = "inline";
        });
        // Déclenche à nouveau le clic sur l'input file pour rechercher un nouveau fichier
        inputFile.click();
      });
    };

    reader.readAsDataURL(file);
  }
});

// Gestion du POST pour ajouter un projet
const postForm = document.getElementById("post-form");

postForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut

  // Crée un objet FormData à partir du formulaire
  const formData = new FormData(postForm);

  formData.append("image", inputFile.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Récupère et affiche la réponse JSON
    const data = await response.json();
    console.log("Projet ajouté avec succès", data);

    // Ajoute le nouveau projet à la galerie
    galleryData.push(data); // Ajoute le projet à la liste globale
    displayProjects(galleryData); // Met à jour l'affichage de la galerie

    // Réinitialiser le formulaire après l'ajout
    postForm.reset();

    // Supprime l'aperçu de l'image si nécessaire
    const previewWrapper = document.querySelector(".image-preview-wrapper");
    if (previewWrapper) {
      previewWrapper.remove();
    }

    // Réaffiche l'interface d'origine
    const iconWrapper = document.querySelector(".icon-wrapper");
    if (iconWrapper) {
      iconWrapper.style.display = "block"; // Affiche l'icône
    }

    const uploadButton = document.getElementById("uploadButton");
    if (uploadButton) {
      uploadButton.style.display = "block"; // Affiche le bouton d'upload
    }

    const formSpans = document.querySelectorAll(".form-upload span");
    formSpans.forEach((span) => {
      span.style.display = "inline"; // Affiche les spans
    });

    // Ferme la modale
    const modalElement = document.getElementById("modal");
    closeModal(modalElement); // Appelle la fonction pour fermer la modale

    // Affiche le projet nouvellement ajouté
    displayProjects([data]); // ou fetchProjects() pour récupérer tous les projets
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
  }
});
