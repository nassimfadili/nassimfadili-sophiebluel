// 1. Déclarations des variables globales
const galerie = document.querySelector(".gallery");
const buttonFilter = document.querySelector(".nav-list");
let oeuvresData = [];

// 2. Fonctions de récupération des données
function fetchOeuvres() {
  return fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erreur de récupération des données des oeuvres:", error);
    });
}

function fetchCategories() {
  return fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erreur de récupération des données:", error);
    });
}

// 3. Fonctions de création d'éléments
function creerEtAfficherOeuvre(oeuvre) {
  const figureElement = document.createElement("figure");
  const imageElement = document.createElement("img");
  imageElement.src = oeuvre.imageUrl;

  const titreElement = document.createElement("figcaption");
  titreElement.textContent = oeuvre.title;

  figureElement.appendChild(imageElement);
  figureElement.appendChild(titreElement);

  galerie.appendChild(figureElement);
}

function creerFiltre(filterButton) {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("nav-projet");
  buttonElement.textContent = filterButton.name;

  buttonElement.addEventListener("click", function () {
    if (filterButton.name === "Tous") {
      afficherToutesOeuvres();
    } else {
      afficherFiltre(filterButton.name);
    }
  });

  buttonFilter.appendChild(buttonElement);
}

// 4. Fonctions d'affichage
function afficherToutesOeuvres() {
  galerie.innerHTML = "";
  oeuvresData.forEach(creerEtAfficherOeuvre);
}

function afficherFiltre(nomCategorie) {
  galerie.innerHTML = "";
  const oeuvresFilter = oeuvresData.filter(
    (work) => work.category.name === nomCategorie
  );
  oeuvresFilter.forEach(creerEtAfficherOeuvre);
}

// 5. Initialisation
fetchOeuvres().then((data) => {
  oeuvresData = data;
  afficherToutesOeuvres(); // Afficher toutes les œuvres initialement

  const tousButton = document.createElement("button");
  tousButton.classList.add("nav-projet");
  tousButton.textContent = "Tous";
  tousButton.addEventListener("click", afficherToutesOeuvres);
  buttonFilter.appendChild(tousButton);
});

fetchCategories().then((data) => {
  data.forEach(creerFiltre); // Pour chaque catégorie, créer un bouton de filtre
});
