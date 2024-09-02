// Fonction asynchrone pour authentifier l'utilisateur en envoyant une requête POST à l'API de connexion
async function loginUser(email, password) {
  // URL de l'API pour la connexion des utilisateurs
  const loginUrl = "http://localhost:5678/api/users/login";
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during user login:", error.message);
  }
}

// Fonction pour gérer la soumission du formulaire et appeler loginUser
function setupFormHandler() {
  const formElement = document.getElementById("contact");
  const errorContainer = document.getElementById("error-container");

  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    errorContainer.innerHTML = "";

    // Appeler loginUser avec les valeurs du formulaire
    try {
      const userData = await loginUser(userEmail, userPassword);
      if (userData) {
        // Si userData est correct, rediriger vers index.html
        window.location.href = "index.html";
        return;
      }

      // Si userData est incorrect, afficher un message d'erreur
      errorContainer.innerHTML = `
          <div class="error-message">
            <span>E-mail ou mot de passe incorrect.</span>
          </div>
        `;
    } catch (error) {
      console.error("Error during user login:", error.message);
    }
  });
}

setupFormHandler();
