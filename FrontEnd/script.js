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
    allButton.addEventListener("click", () => {
      displayWorks(worksData);
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
        displayWorks(filteredWorks);
      });

      filtersDiv.appendChild(button);
    });
  });


// Vérification du token
document.addEventListener("DOMContentLoaded", () => {

  const token = sessionStorage.getItem("token");

  if (token) {
    document.body.classList.add("edit-mode");
  }
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
});

const backToGallery = document.getElementById("backToGallery");

backToGallery.addEventListener("click", () => {
  modalAddView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
});