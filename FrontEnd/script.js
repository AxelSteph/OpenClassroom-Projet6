let worksData = [];

// Fonction pour afficher les works
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

// Récupération des works
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    worksData = data;
    displayWorks(worksData);
  });

// Récupération des catégories
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
