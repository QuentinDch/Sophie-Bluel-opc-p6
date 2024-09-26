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

    const data = await response.json();

    // Stock le token dans sessionStorage
    if (data?.token) {
      sessionStorage.setItem("authToken", data.token);
    }

    return data;
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

    const emailInput = formElement.querySelector("#email").value;
    const passwordInput = formElement.querySelector("#password").value;

    errorContainer.innerHTML = "";

    // Appel loginUser avec les valeurs du formulaire
    try {
      const userData = await loginUser(emailInput, passwordInput);
      if (userData && userData?.token) {
        // Si userData est correct et contient un token, redirection vers index.html
        window.location.href = "index.html";
        console.log("User logged in successfully:", userData);
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
