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
      galleryDivElement.appendChild(worksFigElement);
      let worksImgElement = document.createElement("img");
      worksFigElement.appendChild(worksImgElement);
      worksImgElement.src = project.imageUrl;
      let worksFigcaptionElement = document.createElement("figcaption");
      worksFigcaptionElement.textContent = project.title;
      worksFigElement.appendChild(worksFigcaptionElement);
    }
  } catch (error) {
    console.error(error.message);
  }
}

fetchGalleryData();
