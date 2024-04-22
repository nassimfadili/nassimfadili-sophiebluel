const galerie = document.querySelector(".gallery");
const tous = document.getElementById("Tous");
const objets = document.getElementById("Objets");
const appartements = document.getElementById("Appartements");
const hotelRestaurant = document.getElementById("HotelRestaurants");

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

// Requête Fetch pour obtenir les données JSON
fetch("http://localhost:5678/api/works")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((data) => {
    // Afficher toutes les œuvres initialement
    data.forEach(creerEtAfficherOeuvre);

    // Ajout de l'événement de clic sur l'élément "Appartements"
    appartements.addEventListener("click", function () {
      // Filtrer les œuvres pour obtenir uniquement celles avec la catégorie "Appartements"
      const oeuvresAppartements = data.filter(
        (work) => work.category.name === "Appartements"
      );
      // Effacer la galerie actuelle
      galerie.innerHTML = "";
      // Afficher les œuvres filtrées dans la galerie
      oeuvresAppartements.forEach(creerEtAfficherOeuvre);
    });
    // Ajout de l'événement de clic sur l'élément "Hotel et Restaurants"
    hotelRestaurant.addEventListener("click", function () {
      // Filtrer les œuvres pour obtenir uniquement celles avec la catégorie "Hotel et Restaurants"
      const oeuvresHotelRestaurants = data.filter(
        (work) => work.category.name === "Hotels & restaurants"
      );
      // Effacer la galerie actuelle
      galerie.innerHTML = "";
      // Afficher les œuvres filtrées dans la galerie
      oeuvresHotelRestaurants.forEach(creerEtAfficherOeuvre);
    });
    // Ajout de l'événement de clic sur l'élément "Objets"
    objets.addEventListener("click", function () {
      // Filtrer les œuvres pour obtenir uniquement celles avec la catégorie "Objets"
      const oeuvresObjets = data.filter(
        (work) => work.category.name === "Objets"
      );
      // Effacer la galerie actuelle
      galerie.innerHTML = "";
      // Afficher les œuvres filtrées dans la galerie
      oeuvresObjets.forEach(creerEtAfficherOeuvre);
    });
    // Ajout de l'événement de clic sur l'élément "Tous"
    tous.addEventListener("click", function () {
      //Afficher toutes les oeuvres
      galerie.innerHTML = "";
      data.forEach(creerEtAfficherOeuvre);
    });
  });
