async function fetchGalleryData() {
  const worksApiUrl = "http://localhost:5678/api/works";
  try {
    const response = await fetch(worksApiUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const galleryData = await response.json();
    console.log(galleryData);
  } catch (error) {
    console.error(error.message);
  }
}

fetchGalleryData();
