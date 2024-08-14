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

    for (let i = 0; i < galleryData.length; i++) {
      const project = galleryData[i];

      let worksFigElement = document.createElement("figure");
      worksFigElement.id = `project-${project.id}`;

      let worksImgElement = document.createElement("img");
      worksImgElement.src = project.imageUrl;
      worksImgElement.alt = project.title;

      let worksFigcaptionElement = document.createElement("figcaption");
      worksFigcaptionElement.textContent = project.title;

      galleryDivElement.appendChild(worksFigElement);
      worksFigElement.append(worksImgElement, worksFigcaptionElement);
    }
  } catch (error) {
    console.error(error.message);
  }
}

fetchGalleryData();

async function fetchCategoriesGalleryData() {
  const categoriesGalleryUrl = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(categoriesGalleryUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categoriesData = await response.json();
    console.log(categoriesData);
  } catch (error) {
    console.error(error.message);
  }
}

fetchCategoriesGalleryData();
