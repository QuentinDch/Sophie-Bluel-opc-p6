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
// Appel de la fonction avec des paramètres
loginUser("sophie.bluel@test.tld", "S0phie");
