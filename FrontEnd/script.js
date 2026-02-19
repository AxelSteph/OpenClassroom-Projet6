fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {

    const gallery = document.querySelector(".gallery");

    data.forEach(work => {

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

  })
  .catch(error => {
    console.error("Erreur :", error);
  });

  fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {
    console.log(categories);
  });
