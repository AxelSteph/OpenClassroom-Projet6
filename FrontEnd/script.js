let worksData = [];

// Affiche les works
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Récup des works
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    worksData = data;
    displayWorks(worksData);
  });

// Récup des catégories
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {

    const filtersDiv = document.querySelector(".filters");

    // Bouton Tous
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("active");
    allButton.addEventListener("click", () => {
      displayWorks(worksData);
      allButton.classList.add("active");
      filtersDiv.querySelectorAll("button").forEach(btn => {
        if (btn !== allButton) {
          btn.classList.remove("active");
        }
      });
    });
    filtersDiv.appendChild(allButton);

    // Boutons catégories
    categories.forEach(category => {

      const button = document.createElement("button");
      button.innerText = category.name;

      button.addEventListener("click", () => {
        const filteredWorks = worksData.filter(work =>
          work.categoryId === category.id
        );
        button.classList.add("active");
        filtersDiv.querySelectorAll("button").forEach(btn => {
          if (btn !== button) {
            btn.classList.remove("active");
          }
        });
        displayWorks(filteredWorks);
      });

      filtersDiv.appendChild(button);
    });
  });


// Vérification du token / mode édition
document.addEventListener("DOMContentLoaded", () => {

  const token = sessionStorage.getItem("token");
  const authLink = document.getElementById("authLink");

  if (token) {
    // Mode édition
    document.body.classList.add("edit-mode");

    // Changement de login à logout
    authLink.textContent = "logout";
    authLink.href = "#";

    authLink.addEventListener("click", () => {

      // Supprimer le token
      sessionStorage.removeItem("token");

      // Enlève le mode édition
      document.body.classList.remove("edit-mode");

      // Recharge la page
      window.location.reload();
    });
  }

  loadCategories();
});

// Modal

const modal = document.getElementById("modal");
const editButton = document.getElementById("editButton");
const closeModal = document.getElementById("closeModal");

editButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
  displayModalWorks();
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalAddView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
  preview.classList.add("hidden");
  backToGallery.classList.add("hidden");
  preview.src = "";
  imageUpload.querySelector("i").style.display = "block";
  imageUpload.querySelector("label").style.display = "block";
  imageUpload.querySelector("p").style.display = "block";
});


// Affiche works dans la modale
function displayModalWorks() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  worksData.forEach(work => {
    const div = document.createElement("div");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.style.width = "80px";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Voulez-vous vraiment supprimer cette photo ?");
      if (!confirmDelete) {
        return;
      }
      deleteWork(work.id);
    });

    div.appendChild(img);
    div.appendChild(deleteBtn);
    modalGallery.appendChild(div);
  });
}

// Supprimer un work
function deleteWork(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur suppression");
    }

    // Retirer du tableau
    worksData = worksData.filter(work => work.id !== id);

    // Mettre à jour affichage
    displayWorks(worksData);
    displayModalWorks();
  })
  .catch(error => console.error(error));
}

// Ajout d'un work
const openAddForm = document.getElementById("openAddForm");
const modalGalleryView = document.getElementById("modalGalleryView");
const modalAddView = document.getElementById("modalAddView");

openAddForm.addEventListener("click", () => {
  modalGalleryView.classList.add("hidden");
  modalAddView.classList.remove("hidden");
  backToGallery.classList.remove("hidden");
});

const backToGallery = document.getElementById("backToGallery");

backToGallery.addEventListener("click", () => {
  modalAddView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
  preview.classList.add("hidden");
  backToGallery.classList.add("hidden");
  preview.src = "";
  imageUpload.querySelector("i").style.display = "block";
  imageUpload.querySelector("label").style.display = "block";
  imageUpload.querySelector("p").style.display = "block";
});


// Formulaire d'ajout
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");

function checkForm() {
  if (
    imageInput.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    categorySelect.value !== ""
  ) {
    submitBtn.disabled = false;
    submitBtn.classList.add("active");
  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("active");
  }
}

imageInput.addEventListener("change", checkForm);
titleInput.addEventListener("input", checkForm);
categorySelect.addEventListener("change", checkForm);

function loadCategories() {
  fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {

      const select = document.getElementById("category");

      // On vide le select au cas où
      select.innerHTML = "";

      // Option vide par défaut
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "";
      select.appendChild(defaultOption);

      // On ajoute les catégories
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });

    })
    .catch(error => {
      console.error("Erreur lors du chargement des catégories :", error);
    });
}

const image = document.getElementById("image");
const preview = document.getElementById("imagePreview");
const imageUpload = document.querySelector(".image-upload");

image.addEventListener("change", function () {

  const file = image.files[0];
  if (!file) return;

  if (file.size > 4 * 1024 * 1024) {
    alert("L'image ne doit pas dépasser 4Mo");
    image.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.classList.remove("hidden");

    // On cache tout le contenu sauf l'image
    imageUpload.querySelector("i").style.display = "none";
    imageUpload.querySelector("label").style.display = "none";
    imageUpload.querySelector("p").style.display = "none";
  };

  reader.readAsDataURL(file);

});

const form = document.getElementById("addPhotoForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const image = document.getElementById("image").files[0];
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
    },
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout");
    }
    return response.json();
  })
  .then(newWork => {

    worksData.push(newWork);

    displayWorks(worksData);

    displayModalWorks();

    form.reset();

    document.getElementById("modalAddView").classList.add("hidden");
    document.getElementById("modalGalleryView").classList.remove("hidden");
    backToGallery.classList.add("hidden");
    preview.src = "";
    imageUpload.querySelector("i").style.display = "block";
    imageUpload.querySelector("label").style.display = "block";
    imageUpload.querySelector("p").style.display = "block";
  })
  .catch(error => {
    console.error(error);
  });

});