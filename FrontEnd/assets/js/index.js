const galerie = document.querySelector(".gallery");

// Requête Fetch pour obtenir les données JSON
function fetchOeuvres() {
  return fetch("http://localhost:5678/api/works")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .catch((error)=> {
    console.error("Erreur de récupération des données des oeuvres:", error);
  });
}

// Récupérer les données des catégories et créer les boutons de filtre
function fetchCategories() {
  return fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .catch((error) => {
    console.error("Erreur de récupération des données:", error);
  });
}

// Fonction pour créer et afficher une œuvre dans la galerie
function creerEtAfficherOeuvre(oeuvre) {
  // Création d'un élément de figure pour l'œuvre
  const figureElement = document.createElement("figure");

  // Création d'un élément d'image pour l'URL de l'image de l'œuvre
  const imageElement = document.createElement("img");
  imageElement.src = oeuvre.imageUrl;

  // Création d'un élément de légende pour le titre de l'œuvre
  const titreElement = document.createElement("figcaption");
  titreElement.textContent = oeuvre.title;

  // Ajout de l'image et de la légende à la figure
  figureElement.appendChild(imageElement);
  figureElement.appendChild(titreElement);

  // Ajout de la figure à la galerie
  galerie.appendChild(figureElement);
}

fetchOeuvres()
  .then((data) => {
    oeuvresData = data;
    // Afficher toutes les œuvres initialement
    data.forEach(creerEtAfficherOeuvre);

    const tousButton = document.createElement("button");
    tousButton.classList.add("nav-projet");
    tousButton.textContent = "Tous";
    tousButton.addEventListener("click", afficherToutesOeuvres);
    buttonFilter.appendChild(tousButton);
  });

// Récupérer la référence à l'élément contenant les boutons de filtre
const buttonFilter = document.querySelector(".nav-list");

// Fonction pour créer un bouton de filtre
function creerFiltre(filterButton) {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("nav-projet");
  buttonElement.textContent = filterButton.name;
  buttonElement.addEventListener("click", function () {
    if (filterButton.name === "Tous") {
      afficherToutesOeuvres();
    } else {
      afficherFiltre(filterButton.name); // Appeler la fonction d'affichage de filtre avec le nom de la catégorie
    }
  });
  buttonFilter.appendChild(buttonElement);
}
// Fonction pour afficher toutes les œuvres
function afficherToutesOeuvres() {
  galerie.innerHTML = ""; // Vider la galerie
  oeuvresData.forEach(creerEtAfficherOeuvre); // Afficher toutes les œuvres
}
// Fonction pour afficher les œuvres filtrées
function afficherFiltre(nomCategorie) {
  galerie.innerHTML = "";
  const oeuvresFilter = oeuvresData.filter(
    (work) => work.category.name === nomCategorie
  );
  oeuvresFilter.forEach(creerEtAfficherOeuvre);
}

fetchCategories()
  .then((data) => {
    data.forEach(creerFiltre); // Pour chaque catégorie, créer un bouton de filtre
  });
