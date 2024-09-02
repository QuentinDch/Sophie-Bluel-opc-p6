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
// Appel de la fonction avec les paramètres
loginUser("sophie.bluel@test.tld", "S0phie");

// Fonction pour gérer la soumission du formulaire et appeler loginUser
function setupFormHandler() {
  const formElement = document.getElementById("contact");
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page ou l'envoi du formulaire
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    // Appeler loginUser avec les valeurs du formulaire
    const userData = await loginUser(userEmail, userPassword);

    // Traiter les données utilisateur ou gérer les erreurs ici
    console.log(userData);
  });
}
setupFormHandler();
