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

    let errorMessageDiv = document.querySelector(".error-message");
    if (!errorMessageDiv) {
      errorMessageDiv = document.createElement("div");
      errorMessageDiv.className = "error-message";
      loginFormElement.parentNode.insertBefore(
        errorMessageDiv,
        loginFormElement
      );
    }

    errorMessageDiv.innerHTML = "";

    // Appel loginUser avec les valeurs du formulaire
    try {
      const userData = await loginUser(emailInput, passwordInput);
      if (userData && userData?.loginData) {
        window.location.href = "index.html";
        return;
      }

      const errorMessageSpan = document.createElement("span");
      errorMessageSpan.textContent = "L'e-mail et le mot de passe sont requis.";
      errorMessageDiv.appendChild(errorMessageSpan);
    } catch (error) {
      console.error("Error during user login:", error.message);
    }
  });
}

setupFormHandler();
