// Sélection des éléments du DOM
const header = document.querySelector("header");
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");

// Fonction pour créer et afficher la première modal
async function creerModal1(data) {
  modal1.innerHTML = ""; // Vider le contenu existant de la modal1

  // Création des éléments de la modal
  const divElementContent = document.createElement("div");
  divElementContent.classList.add("modal-content");

  const closeButtonSpan = document.createElement("i");
  closeButtonSpan.classList.add("close", "fas", "fa-times");
  closeButtonSpan.addEventListener("click", cacherModal1);

  const titreElement = document.createElement("h1");
  titreElement.innerHTML = "Galerie Photo";
  titreElement.id = "titreModal1";

  const divImagesContainer = document.createElement("div");
  divImagesContainer.classList.add("images-container");

  // Création des éléments pour chaque image
  data.forEach((item) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const imageModal = document.createElement("img");
    imageModal.src = item.imageUrl;

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    trashIcon.addEventListener("click", () => {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
        supprimerImage(item.id);
      }
    });

    imageContainer.appendChild(imageModal);
    imageContainer.appendChild(trashIcon);
    divImagesContainer.appendChild(imageContainer);
  });

  // Ajout des éléments à la modal
  divElementContent.appendChild(closeButtonSpan);
  divElementContent.appendChild(titreElement);
  divElementContent.appendChild(divImagesContainer);
  divElementContent
    .appendChild(document.createElement("div"))
    .classList.add("separator");

  const buttonAjoutPhoto = document.createElement("button");
  buttonAjoutPhoto.classList.add("button-ajout-photo");
  buttonAjoutPhoto.textContent = "Ajouter une photo";
  buttonAjoutPhoto.addEventListener("click", afficherModal2);
  divElementContent.appendChild(buttonAjoutPhoto);

  modal1.appendChild(divElementContent);
}

// Fonction pour récupérer et afficher les données dans la modal
function fetchModalData() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then(creerModal1)
    .catch((error) =>
      console.error("Erreur lors du chargement des données de la modal:", error)
    );
}

// Appel initial pour afficher les images dans la modal
fetchModalData();

// Fonctions pour gérer l'affichage des modals
const afficherModal1 = () => (modal1.style.display = "flex");
const cacherModal1 = () => (modal1.style.display = "none");
const afficherModal2 = () => {
  cacherModal1();
  modal2.style.display = "flex";
};
const cacherModal2 = () => (modal2.style.display = "none");
const retourModal1 = () => {
  cacherModal2();
  afficherModal1();
};

// Vérification de la validité du token
function getTokenExpired() {
  const itemStr = localStorage.getItem("token");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("token");
    return null;
  }
  return item.value;
}

// Fonction pour supprimer une image
async function supprimerImage(id) {
  const token = getTokenExpired();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `bearer ${token}` },
    });

    if (!response.ok)
      throw new Error("Erreur lors de la suppression de l'image.");
    fetchModalData(); // Actualiser la liste des images après la suppression
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
  }
}

// Ajout de l'événement pour ouvrir la modal 1
document
  .querySelector(".modifier-hover")
  ?.addEventListener("click", afficherModal1);

// Fonction pour créer la modal 2
function creerModal2() {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content2");

  // Création des éléments de la modal
  const closeButton = document.createElement("i");
  closeButton.classList.add("fas", "fa-times", "close");
  closeButton.addEventListener("click", cacherModal2);

  const titre = document.createElement("h1");
  titre.innerHTML = "Ajout Photo";
  titre.id = "titreModal2";

  const divPreviewImage = document.createElement("div");
  divPreviewImage.id = "divPreviewImage";

  const addButton = document.createElement("button");
  addButton.textContent = "+ ajouter photo";

  const inputPhoto = document.createElement("input");
  inputPhoto.type = "file";
  inputPhoto.id = "fileInput";
  inputPhoto.accept = "image/png, image/jpeg";
  inputPhoto.style.display = "none";

  addButton.addEventListener("click", () => inputPhoto.click());

  const previewImage = document.createElement("img");
  previewImage.classList.add("preview-image");
  previewImage.src = "./icons/picture-svgrepo-com.png";
  previewImage.addEventListener("click", () => inputPhoto.click());

  inputPhoto.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        addButton.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  const labelTitre = document.createElement("label");
  labelTitre.textContent = "Titre";
  labelTitre.classList.add("labelTitre");

  const labelCategorie = document.createElement("label");
  labelCategorie.textContent = "Categorie";
  labelCategorie.classList.add("labelCategorie");

  const inputTitre = document.createElement("input");
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
  btnValider.addEventListener("click", ajouterPhoto);

  const divInput = document.createElement("div");
  divInput.id = "divInput";

  const retourArrow = document.createElement("i");
  retourArrow.classList.add("fas", "fa-arrow-left", "back-icon");
  retourArrow.addEventListener("click", retourModal1);

  // Ajout des éléments à la modal
  labelCategorie.append(inputCategorie);
  labelTitre.append(inputTitre);
  divInput.append(labelTitre, labelCategorie);

  modalContent.append(
    closeButton,
    titre,
    inputPhoto,
    divPreviewImage,
    divInput,
    btnValider,
    retourArrow
  );
  divPreviewImage.append(addButton, previewImage);
  modal2.appendChild(modalContent);
}

// Fonction pour charger les catégories dans la modal 2
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

  if (!titleInput || !categorySelect || !fileInput) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (!verifierImage(fileInput)) return;

  const formData = new FormData();
  formData.append("title", titleInput);
  formData.append("image", fileInput);
  formData.append("category", categorySelect);

  const token = getTokenExpired();
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de l'image.");

    alert("Image ajoutée avec succès !");
    retourModal1();
    fetchModalData();
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image :", error);
  }
}

// Fonction pour vérifier la taille et le format de l'image
function verifierImage(file) {
  const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
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

// Création initiale de la modal 2
creerModal2();
