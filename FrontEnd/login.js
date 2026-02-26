const form = document.getElementById("loginForm");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.querySelector(".error-message");

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur dans l’identifiant ou le mot de passe");
    }
    return response.json();
  })
  .then(data => {
    sessionStorage.setItem("token", data.token);

    window.location.href = "index.html";
  })
  .catch(error => {
    errorMessage.innerText = "Email ou mot de passe incorrect";
  });
});