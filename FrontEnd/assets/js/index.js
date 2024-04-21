const galerie = document.querySelector(".gallery");

// Requête Fetch pour obtenir les données JSON
fetch("http://localhost:5678/api/works")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((data) => {
    for (const work of data) {
      // Création d'un élément de figure pour chaque œuvre
      const figureElement = document.createElement("figure");

      // Création d'un élément d'image pour l'URL de l'image de l'œuvre
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;

      // Création d'un élément de légende pour le titre de l'œuvre
      const titreElement = document.createElement("figcaption");
      titreElement.textContent = work.title;

      // Ajout de l'image et de la légende à la figure
      figureElement.appendChild(imageElement);
      figureElement.appendChild(titreElement);

      // Ajout de la figure à la galerie
      galerie.appendChild(figureElement);
    }
  });
