const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");

async function creerModal1(data) {
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

    // Ajout du gestionnaire d'événements pour supprimer l'image correspondante
    trashIcon.addEventListener("click", () => {
      const imageId = modal1.id; // Assurez-vous que modal1 contient l'ID de l'image
      if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
        supprimerImage(imageId);
      }
    });

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

// Fonction pour afficher modal2 et masquer modal1
function afficherModal2() {
  modal1.style.display = "none";
  modal2.style.display = "flex";
}

// Fonction pour revenir à modal1 depuis modal2
function retourModal1() {
  modal2.style.display = "none";
  modal1.style.display = "flex";
}

// Fonction pour supprimer une image
async function supprimerImage(id) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTcwMjUxMywiZXhwIjoxNzE1Nzg4OTEzfQ.S-RTzsMgeM4zSkArclIWhpqQXW2smdDULGhTrVI1VzA";
  const headers = new Headers();
  headers.append("Authorization", `bearer ${token}`);
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'image.");
    }

    // Actualiser la liste des images après la suppression
    await fetchModalData();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
  }
}

const modifierHoverElement = document.querySelector(".modifier-hover");
modifierHoverElement.addEventListener("click", function (e) {
  afficherModal();
});

// Fonction pour créer la modal2
function creerModal2() {
  // Création de la div principale de la modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content2");

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
async function chargerCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    const select = document.getElementById("categorySelect");
    data.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

// Fonction pour ajouter une photo
async function ajouterPhoto() {
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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTcwMjUxMywiZXhwIjoxNzE1Nzg4OTEzfQ.S-RTzsMgeM4zSkArclIWhpqQXW2smdDULGhTrVI1VzA";
  const headers = new Headers();
  headers.append("Authorization", `bearer ${token}`);

  // Envoi de la photo à l'API avec le jeton d'authentification
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de l'image.");
    }

    alert("Image ajoutée avec succès !");
    //retourModal1(); // Retour à modal1 après l'ajout de l'image
    //fetchModalData();//
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image :", error);
  }
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
