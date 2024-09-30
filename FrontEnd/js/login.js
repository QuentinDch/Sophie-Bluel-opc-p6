// Authentifie un utilisateur en envoyant une requête POST à l'API de connexion
async function loginUser(email, password) {
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
      const errorMsg = `Login failed with status: ${response.status}`;
      return { error: errorMsg };
    }

    const loginData = await response.json();

    if (loginData?.token) {
      sessionStorage.setItem("authToken", loginData.token);
    }

    return { loginData };
  } catch (error) {
    console.error("Error during user login:", error.message);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

// Fonction pour gérer la soumission du formulaire et appeler loginUser
function setupFormHandler() {
  const loginFormElement = document.getElementById("login-form");

  loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = loginFormElement.querySelector("#email").value;
    const passwordInput = loginFormElement.querySelector("#password").value;

    // Appel loginUser avec les valeurs du formulaire
    try {
      const userData = await loginUser(emailInput, passwordInput);
      if (userData && userData?.loginData) {
        window.location.href = "index.html";
        return;
      }

      displayError();
    } catch (error) {
      console.error("Error during user login:", error.message);
    }
  });
}

setupFormHandler();

function displayError() {
  const errorMessageDiv = document.querySelector(".error-message");
  const errorMessageSpan = document.getElementById("error-text");

  errorMessageDiv.style.display = "flex";
  errorMessageDiv.setAttribute("aria-hidden", "false");
  errorMessageSpan.textContent = "L'e-mail ou le mot de passe est incorrect.";
}
