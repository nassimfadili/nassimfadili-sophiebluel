const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");

function creerModal1(data) {
  const divElementContent = document.createElement("div");
  divElementContent.classList.add("modal-content");

  const closeButtonSpan = document.createElement("i");
  closeButtonSpan.classList.add("close", "fas", "fa-times");
  closeButtonSpan.addEventListener("click", cacherModal);

  const titreElement = document.createElement("h2");
  titreElement.classList.add("galerie-title");
  titreElement.textContent = "Galerie Photo";

  const divImagesContainer = document.createElement("div");
  divImagesContainer.classList.add("images-container");

  const separator = document.createElement("div");
  separator.classList.add("separator");

  const buttonAjoutPhoto = document.createElement("button");
  buttonAjoutPhoto.classList.add("button-ajout-photo");
  buttonAjoutPhoto.textContent = "Ajouter une photo";
  buttonAjoutPhoto.addEventListener("click", afficherModal2);

  data.forEach((modal1) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const imageModal = document.createElement("img");
    imageModal.src = modal1.imageUrl;

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash", "trash-icon");

    imageContainer.appendChild(imageModal);
    imageContainer.appendChild(trashIcon);
    divImagesContainer.appendChild(imageContainer);
  });

  divElementContent.appendChild(closeButtonSpan);
  divElementContent.appendChild(titreElement);
  divElementContent.appendChild(divImagesContainer);
  divElementContent.appendChild(separator);
  divElementContent.appendChild(buttonAjoutPhoto);
  modal1.appendChild(divElementContent);
}

function fetchModalData() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      creerModal1(data);
    })
    .catch((error) => {
      console.error(
        "Erreur lors du chargement des données de la modal:",
        error
      );
    });
}

fetchModalData();

function afficherModal() {
  modal1.style.display = "flex";
}

function cacherModal() {
  modal1.style.display = "none";
}

const modifierHoverElement = document.querySelector(".modifier-hover");
modifierHoverElement.addEventListener("click", function (e) {
  afficherModal();
});

// Fonction pour créer la modal2
function creerModal2() {
  // Création de la div principale de la modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Création de la croix de fermeture de la modal
  const closeButton = document.createElement("i");
  closeButton.classList.add("fas", "fa-times", "close");
  closeButton.addEventListener("click", cacherModal);

  // Création du titre de la modal
  const titre = document.createElement("h2");
  titre.textContent = "Ajout Photo";

  // Création de l'input pour télécharger une photo
  const inputPhoto = document.createElement("input");
  inputPhoto.type = "file";
  inputPhoto.id = "fileInput";
  inputPhoto.accept = "image/png, image/jpeg"; // Filtre pour les fichiers image uniquement

  // Création de l'aperçu de l'image
  const previewImage = document.createElement("img");
  previewImage.classList.add("preview-image");

  // Gestion du téléchargement de l'image
  inputPhoto.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Création de l'input pour le titre de la photo
  const inputTitre = document.createElement("input");
  inputTitre.type = "text";
  inputTitre.placeholder = "Titre";
  inputTitre.id = "titleInput";

  // Création de l'input pour la catégorie
  const inputCategorie = document.createElement("select");
  inputCategorie.id = "categorySelect";
  inputCategorie.placeholder = "Catégorie";

  // Appel de la fonction pour charger les catégories depuis l'API
  chargerCategories();

  // Création du bouton de validation
  const btnValider = document.createElement("button");
  btnValider.textContent = "Valider";
  btnValider.addEventListener("click", ajouterPhoto);

  // Création de la flèche de retour à modal1
  const retourArrow = document.createElement("i");
  retourArrow.classList.add("fas", "fa-arrow-left", "back-icon");
  retourArrow.addEventListener("click", retourModal1);

  // Ajout de tous les éléments à la modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(titre);
  modalContent.appendChild(inputPhoto);
  modalContent.appendChild(previewImage);
  modalContent.appendChild(inputTitre);
  modalContent.appendChild(inputCategorie);
  modalContent.appendChild(btnValider);
  modalContent.appendChild(retourArrow);

  // Ajout de la modal à la div modal2
  modal2.appendChild(modalContent);
}

// Fonction pour charger les catégories depuis l'API
function chargerCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("categorySelect");
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des catégories:", error);
    });
}

// Fonction pour afficher modal2 et masquer modal1
function afficherModal2() {
  modal1.style.display = "none";
  modal2.style.display = "flex";
}

// Fonction pour revenir à modal1 depuis modal2
function retourModal1() {
  modal2.style.display = "none";
  modal1.style.display = "block";
}

// Fonction pour ajouter une photo
function ajouterPhoto() {
  const titleInput = document.getElementById("titleInput").value;
  const categorySelect = document.getElementById("categorySelect").value;
  const fileInput = document.getElementById("fileInput").files[0];

  // Vérification des champs requis
  if (!titleInput || !categorySelect || !fileInput) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  // Vérification de la taille et du type de l'image
  if (!verifierImage(fileInput)) {
    return;
  }

  // Création de l'objet à envoyer
  const formData = new FormData();
  formData.append("title", titleInput);
  formData.append("categoryId", categorySelect);
  formData.append("image", fileInput);

  // Ajout du jeton d'authentification
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  // Envoi de la photo à l'API avec le jeton d'authentification
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: headers,
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'image.");
      }
      alert("Image ajoutée avec succès !");
      retourModal1(); // Retour à modal1 après l'ajout de l'image
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de l'image :", error);
    });
}

// Fonction pour vérifier la taille et le format de l'image
function verifierImage(file) {
  const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo en octets
  const allowedTypes = ["image/png", "image/jpeg"];
  if (file.size > MAX_SIZE) {
    alert("La taille de l'image ne doit pas dépasser 2 Mo.");
    return false;
  }
  if (!allowedTypes.includes(file.type)) {
    alert("Veuillez sélectionner une image au format PNG ou JPEG.");
    return false;
  }
  return true;
}

// Fonction pour cacher la modal
function cacherModal() {
  modal2.style.display = "none";
}

// Appel de la fonction pour créer la modal2 au chargement de la page
creerModal2();
