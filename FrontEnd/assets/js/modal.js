const header = document.querySelector("header");
console.log(header);
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");

// affichage de la barre noir  superieur en mode edition

// Fonction pour créer la première modal

async function creerModal1(data) {
  modal1.innerHTML = ""; // Vider le contenu existant de la modal1 avant de la remplir

  const divElementContent = document.createElement("div");
  divElementContent.classList.add("modal-content");

  const closeButtonSpan = document.createElement("i");
  closeButtonSpan.classList.add("close", "fas", "fa-times");
  closeButtonSpan.addEventListener("click", cacherModal1);

  const titreElement = document.createElement("h1");

  const spanText = document.createElement("span");
  spanText.textContent = "Galerie Photo";

  const divImagesContainer = document.createElement("div");
  divImagesContainer.classList.add("images-container");

  const separator = document.createElement("div");
  separator.classList.add("separator");

  const buttonAjoutPhoto = document.createElement("button");
  buttonAjoutPhoto.classList.add("button-ajout-photo");
  buttonAjoutPhoto.textContent = "Ajouter une photo";
  buttonAjoutPhoto.addEventListener("click", afficherModal2);

  data.forEach((item) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const imageModal = document.createElement("img");
    imageModal.src = item.imageUrl;

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

    // Ajout du gestionnaire d'événements pour supprimer l'image correspondante
    trashIcon.addEventListener("click", () => {
      const imageId = item.id;
      if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
        supprimerImage(imageId);
      }
    });

    titreElement.appendChild(spanText);
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
// Fonction pour afficher les images dans la modal
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
// Appelle de la fonction pour afficher les images dans la modal
fetchModalData();
// Fonction pour afficher la modal au clique sur le bouton "modifer"
function afficherModal1() {
  modal1.style.display = "flex";
}

// Fonction pour cacher la modal lorsqu'on clique sur 'x'
function cacherModal1() {
  modal1.style.display = "none";
}
// Fonction pour passer a la deuxieme modal lorsqu'on clique sur 'valider'
function afficherModal2() {
  modal1.style.display = "none";
  modal2.style.display = "flex";
}
// Fonction qui permet de retourner en arrière
function retourModal1() {
  modal2.style.display = "none";
  modal1.style.display = "flex";
}
// Fonction qui verifie si le token est valide
function getTokenExpired() {
  const itemStr = localStorage.getItem("token");
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem("token");
    return null;
  }
  return item.value;
}
// Fonction qui permet de suppimer une image dans la modal 2
async function supprimerImage(id) {
  const IsTokenValid = getTokenExpired();
  if (IsTokenValid == null) window.location.href = "login.html";
  const headers = new Headers();
  headers.append("Authorization", `bearer ${IsTokenValid}`);
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'image.");
    }

    // Actualiser la liste des images après la suppression
    fetchModalData();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
  }
}
// permet d'ouvrir la modal 1 au click
const modifierHoverElement = document.querySelector(".modifier-hover");
if (modifierHoverElement) {
  modifierHoverElement.addEventListener("click", function (e) {
    afficherModal1();
  });
}

// Fonction pour créer la modal 2
async function creerModal2() {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content2");

  const closeButton = document.createElement("i");
  closeButton.classList.add("fas", "fa-times", "close");
  closeButton.addEventListener("click", cacherModal2);

  const titre = document.createElement("h1");

  const spanText = document.createElement("span");
  spanText.textContent = "Ajout Photo";

  const divPreviewImage = document.createElement("div");
  divPreviewImage.id = "divPreviewImage";

  const addButton = document.createElement("button");
  addButton.textContent = "+ ajouter photo";

  const inputPhoto = document.createElement("input");
  inputPhoto.placeholder = "+ Ajouter photo";
  inputPhoto.type = "file";
  inputPhoto.id = "fileInput";
  inputPhoto.accept = "image/png, image/jpeg";
  inputPhoto.style.display = "none";

  addButton.addEventListener("click", () => {
    inputPhoto.click();
  });

  const previewImage = document.createElement("img");
  previewImage.classList.add("preview-image");
  previewImage.src = "./icons/picture-svgrepo-com.png";
  previewImage.addEventListener("click", () => {
    inputPhoto.click();
  });

  inputPhoto.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        addButton.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  const inputTitre = document.createElement("input");
  inputTitre.type = "text";
  inputTitre.placeholder = "Titre";
  inputTitre.id = "titleInput";
  inputTitre.classList.add("contact-input");

  const inputCategorie = document.createElement("select");
  inputCategorie.id = "categorySelect";
  inputCategorie.placeholder = "Catégorie";
  inputCategorie.classList.add("contact-input");

  chargerCategories();

  const btnValider = document.createElement("button");
  btnValider.classList.add("button-ajout-photo");
  btnValider.textContent = "Valider";
  btnValider.addEventListener("click", async (event) => {
    event.preventDefault();
    ajouterPhoto();
  });

  const retourArrow = document.createElement("i");
  retourArrow.classList.add("fas", "fa-arrow-left", "back-icon");
  retourArrow.addEventListener("click", retourModal1);

  modalContent.appendChild(closeButton);
  titre.appendChild(spanText);
  modalContent.appendChild(titre);
  modalContent.appendChild(inputPhoto);
  divPreviewImage.appendChild(addButton);
  divPreviewImage.appendChild(previewImage);
  modalContent.appendChild(divPreviewImage);
  modalContent.appendChild(inputTitre);
  modalContent.appendChild(inputCategorie);
  modalContent.appendChild(btnValider);
  modalContent.appendChild(retourArrow);

  modal2.appendChild(modalContent);
}
// Fonction qui charge les categorie dans la modal2
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
// Fonction qui permet d'ajouter une photo dans la modal 2
async function ajouterPhoto() {
  const titleInput = document.getElementById("titleInput").value;
  const categorySelect = document.getElementById("categorySelect").value;
  const fileInput = document.getElementById("fileInput").files[0];
  console.log(document.getElementById("fileInput").files);

  if (!titleInput || !categorySelect || !fileInput) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (!verifierImage(fileInput)) {
    return;
  }

  const formData = new FormData();
  formData.append("title", titleInput);
  formData.append("image", fileInput);
  formData.append("category", categorySelect);
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  const IsTokenValid = getTokenExpired();
  if (IsTokenValid == null) window.location.href = "login.html";
  const headers = new Headers();
  headers.append("Authorization", `bearer ${IsTokenValid}`);

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
    retourModal1();
    fetchModalData();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image :", error);
  }
}
// Fonction qui verifie si l'image est a la bonne taille
function verifierImage(file) {
  const MAX_SIZE = 2 * 1024 * 1024;
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
// Fonction qui permet de cacher la modal2 au clique sur 'x'
function cacherModal2() {
  modal2.style.display = "none";
}

// Création initiale de la modal2
creerModal2();

//java script
