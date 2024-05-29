/* Variables */
const url = "http://localhost:5678/";
const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const form = document.querySelector("#login");
const loginErrorMessage = document.querySelector(".login-error-message");

/* Ecouter la soumission du formulaire pour connecter l'utilisateur */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  getUsers();
});

/* Envoyer une requête POST pour connecter l'utilisateur */
async function getUsers() {
  const body = JSON.stringify({
    email: emailInput.value,
    password: passwordInput.value,
  });
  try {
    const response = await fetch(url + "api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la connexion");
    }

    const data = await response.json();
    const now = new Date();
    const tokenObject = {
      value: data.token,
      expiry: now.getTime() + 3600000,
    };
    localStorage.setItem("token", JSON.stringify(tokenObject));
    localStorage.setItem("authentifie", "true");
    window.location.href = "index_edit.html";
  } catch (error) {
    console.error(error);
    loginErrorMessage.textContent =
      "Erreur dans l’identifiant ou le mot de passe.";
  }
}
