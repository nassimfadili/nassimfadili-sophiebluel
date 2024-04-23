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
      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = "/FrontEnd/assets/index.html";
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
});
