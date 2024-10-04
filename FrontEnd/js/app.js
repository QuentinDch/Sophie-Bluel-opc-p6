let galleryData = []; // Variable globale pour stocker les données des projets récupérées depuis l'API

// Fonction asynchrone pour récupérer les données des projets à partir de l'API et les afficher dans la galerie
async function fetchGalleryData() {
  const worksApiUrl = "http://localhost:5678/api/works";

  try {
    const response = await fetch(worksApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    galleryData = await response.json(); // Convertit en JSON et stocke les données dans la variable globale

    displayProjects(galleryData); // Appelle la fonction pour afficher tous les projets récupérés dans la galerie
  } catch (error) {
    console.error("Error fetching gallery data:", error.message);
  }
}
fetchGalleryData();

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
  const galleryDivElement = document.querySelector(".gallery");
  galleryDivElement.innerHTML = ""; // Efface le contenu existant pour éviter les duplications lors de l'affichage

  projects.forEach((project) => {
    const worksFigElement = createGalleryElement(project);
    galleryDivElement.appendChild(worksFigElement);
  });
}

// Fonction qui crée un élément HTML "figure" pour afficher un projet dans la galerie
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

      const btnId = parseInt(button.id, 10); // Convertir l'ID en nombre

      // Utilise filterProjectsByCategory pour obtenir les projets filtrés
      const filteredProjects = filterProjectsByCategory(btnId);
      displayProjects(filteredProjects); // Affiche les projets filtrés
    });
  });
}

// Fonction pour filtrer les projets en fonction de l'ID de catégorie
function filterProjectsByCategory(categoryId) {
  if (categoryId !== 0) {
    return galleryData.filter((project) => project.categoryId === categoryId);
  }
  return galleryData; // Retourne tous les projets si l'ID est 0
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
        window.location.reload(); // Rafraîchir la page après déconnexion
      });

      // Création et ajout du bouton "modifier"
      const btnContainer = createEditButton();
      portfolio.appendChild(btnContainer);

      return;
    }
  }
}
TokenVerification();

// Fonction de création et d'interaction du bouton de la modale
function createEditButton() {
  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", "Modifier");

  const span = document.createElement("span");
  span.textContent = "modifier";

  button.appendChild(span);
  btnContainer.appendChild(button);

  button.addEventListener("click", openEditModal);

  return btnContainer;
}

function openEditModal() {
  const modalElement = document.getElementById("modal");
  const modalContent = modalElement.querySelector("#homepage-edit1");

  modalElement.style.display = null;
  modalElement.setAttribute("aria-hidden", "false");

  // Pour éviter la fermeture de la modale lorsque l'utilisateur clique à l'intérieur
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
  buttonModalElement.setAttribute("aria-label", "Supprimer un projet");

  figureModalElement.appendChild(imgModalElement);
  figureModalElement.appendChild(buttonModalElement);

  // Ajout de l'écouteur d'event pour supprimer un projet
  buttonModalElement.addEventListener("click", () => {
    openDeleteModal(project.id, figureModalElement);
  });

  return figureModalElement;
}

// Fonction qui ouvre la modale et gère les boutons de confirmation et d'annulation
function openDeleteModal(projectId, figureElement) {
  const overlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("modal-delete");

  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden", "false");

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");

  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  cancelDeleteBtn.addEventListener("click", () => closeDeleteModal());

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", async () => {
    await deleteProject(figureElement, projectId);
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

let authToken = sessionStorage.getItem("authToken");

async function deleteProject(figureElement, projectId) {
  try {
    const response = await fetch(
      `http://localhost:5678/api/works/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Erreur lors de la suppression du projet (code: ${response.status})`
      );
      return;
    }

    // Mise à jour des données locales et de l'interface
    galleryData = galleryData.filter((project) => project.id !== projectId);
    displayProjects(galleryData); // Mets à jour l'affichage de la galerie
    figureElement.remove(); // Supprime l'élément visuellement après confirmation
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  }
}

// Fonction pour naviguer dans la modale
function addAddPictureListener() {
  const btnAddPicture = document.getElementById("btn-add-picture");
  const homepageEdit2 = document.getElementById("homepage-edit2");
  const btnPrevModal = document.getElementById("btn-prev-modal");

  btnAddPicture.addEventListener("click", () => {
    homepageEdit2.style.clipPath = "inset(0 0 0 0)";
    btnPrevModal.style.display = "flex";

    btnPrevModal.addEventListener("click", closePicturePage);
    btnPrevModal.addEventListener("click", removeDisplayError);
  });

  function closePicturePage() {
    homepageEdit2.style.clipPath = "inset(0 0 100% 0)";
    btnPrevModal.style.display = "none";
  }

  function removeDisplayError() {
    const errorMessageDiv = document.querySelector(".missing-error-message");
    errorMessageDiv.style.display = "none";
    errorMessageDiv.setAttribute("aria-hidden", "true");
  }
}

// Fonction pour ajouter les catégories au select
function populateCategorySelect(categories) {
  const selectElement = document.getElementById("category");

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "";
  defaultOption.value = "";
  defaultOption.selected = true; // Sélectionnée par défaut
  defaultOption.disabled = true; // Ne peut pas être sélectionnée
  selectElement.appendChild(defaultOption);

  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    selectElement.appendChild(optionElement);
  });
}

// Déclenche le clic sur l'input file
const fileUploadButton = document.getElementById("uploadButton");
fileUploadButton.addEventListener("click", () => {
  // simule un clic sur "fileInput"
  document.getElementById("fileInput").click();
});

// Prévisualisation de l'image
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

// Ecouter les changements de l'input file
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    const imagePreviewWrapper = document.createElement("div");
    imagePreviewWrapper.classList.add("image-preview-wrapper");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "Aperçu de l'image téléchargée";
    imagePreviewWrapper.appendChild(img);
    // Insère le conteneur d'image après le bouton d'upload
    uploadButton.after(imagePreviewWrapper);

    // Cache la div et ses éléments après la prévisualisation
    const iconWrapper = document.querySelector(".icon-wrapper");
    if (iconWrapper) {
      iconWrapper.style.display = "none";
    }

    if (uploadButton) {
      uploadButton.style.display = "none";
    }

    const formSpans = document.querySelectorAll(".form-upload span");
    formSpans.forEach((span) => {
      span.style.display = "none";
    });

    // Ajout et récupération du bouton + Event
    const changeButton = createChangePhotoButton(imagePreviewWrapper);

    changeButton.addEventListener("click", () => {
      imagePreviewWrapper.remove();
      fileInput.value = "";

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
      fileInput.click();
    });
  }
});

// Fonction pour créer le bouton "Changer de photo" et le retourner
function createChangePhotoButton(imagePreviewWrapper) {
  const changeButton = document.createElement("button");
  changeButton.classList.add("change-btn");
  changeButton.type = "button";
  changeButton.title = "Modifier le fichier téléchargé";
  changeButton.setAttribute("aria-label", "Changer de photo");
  imagePreviewWrapper.appendChild(changeButton);
  return changeButton;
}

// Gestion du POST pour ajouter un projet
const postForm = document.getElementById("post-form");

postForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut

  // Vérification des champs obligatoires
  const fileInput = document.getElementById("fileInput");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");

  if (!fileInput.files.length || !categorySelect.value || !titleInput.value) {
    displayError(); // Affiche le message d'erreur si des champs sont vides
    return; // Sort de la fonction pour ne pas continuer l'envoi du formulaire
  }

  const formData = new FormData(postForm);
  formData.append("image", fileInput.files[0]); // Ajoute l'image au FormData

  try {
    // Envoi de la requête POST avec fetch
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`, // Ajoute l'authentification
      },
    });

    // Vérifie si la réponse est correcte
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Récupère et affiche la réponse JSON
    const data = await response.json();
    console.log("Projet ajouté avec succès", data);

    // Réinitialiser le formulaire après l'ajout
    resetForm();

    // Ferme la modale
    const modalElement = document.getElementById("modal");
    closeModal(modalElement);

    // Affiche le projet nouvellement ajouté
    galleryData.push({ ...data, categoryId: Number(data.categoryId) });
    displayProjects(galleryData); // Met à jour l'affichage de la galerie
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
  }
});

// Fonction pour réinitialiser le formulaire et afficher l'interface d'origine
function resetForm() {
  postForm.reset(); // Réinitialise le formulaire

  // Supprime l'aperçu de l'image si nécessaire
  const imagePreviewWrapper = document.querySelector(".image-preview-wrapper");
  if (imagePreviewWrapper) {
    imagePreviewWrapper.remove();
  }

  // Réaffiche l'interface d'origine
  const iconWrapper = document.querySelector(".icon-wrapper");
  if (iconWrapper) {
    iconWrapper.style.display = "block";
  }

  const uploadButton = document.getElementById("uploadButton");
  if (uploadButton) {
    uploadButton.style.display = "block";
  }

  const formSpans = document.querySelectorAll(".form-upload span");
  formSpans.forEach((span) => {
    span.style.display = "inline";
  });

  const errorMessageDiv = document.querySelector(".missing-error-message");
  if (errorMessageDiv) {
    errorMessageDiv.style.display = "none";
    errorMessageDiv.setAttribute("aria-hidden", "true");
  }
}

// Fonction pour afficher un message d'erreur
function displayError() {
  const errorMessageDiv = document.querySelector(".missing-error-message");
  const errorMessageSpan = document.querySelector(".missing-error-text");

  errorMessageDiv.style.display = "flex";
  errorMessageDiv.setAttribute("aria-hidden", "false");
  errorMessageSpan.textContent =
    "Tous les champs doivent être remplis pour soumettre un projet.";
}
