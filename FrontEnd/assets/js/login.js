document.getElementById("login").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  // Récupérer les valeurs du formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Créer un objet avec les données du formulaire
  const formData = {
    email: email,
    password: password,
  };

  // Envoyer les données au serveur via Fetch
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Erreur de connexion");
      }
      return response.json();
    })
    .then((data) => {
      // Stocker le jeton d'authentification côté client
      const token = data.token; // Supposons que le jeton est renvoyé sous la clé "token" dans la réponse JSON
      // Stocker le jeton dans le localStorage par exemple
      localStorage.setItem("token", token);

      // Rediriger l'utilisateur après une connexion réussie
      window.location.href = "/FrontEnd/assets/index_edit.html";
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
});
