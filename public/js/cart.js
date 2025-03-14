document.addEventListener("DOMContentLoaded", function () {
  fetchProductsAndDisplayCart();
  ecouteFormulaire();
});

function getApiUrl() {
  return window.location.hostname === "kanap-vm.vercel.app"
    ? "https://kanap-production-d0c8.up.railway.app"
    : "http://localhost:4200";
}

function fetchProductsAndDisplayCart() {
  fetch(`${getApiUrl()}/api/products/`)
    .then((res) => res.json())
    .then((produits) => recupererDonneesAchat(produits))
    .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML =
        "<h1>Erreur 404</h1>";
      console.error("API => erreur 404 : ", err);
    });
}

function recupererDonneesAchat(produits) {
  const panier = JSON.parse(localStorage.getItem("Produit")) || [];
  if (panier.length === 0) {
    document.querySelector("#cartAndFormContainer").innerHTML =
      "<h1>Votre panier est vide</h1>";
    return;
  }

  panier.forEach((achat) => {
    const produit = produits.find((p) => p._id === achat.id);
    if (produit) {
      Object.assign(achat, {
        name: produit.name,
        price: produit.price || 0,
        imageUrl: produit.imageUrl,
        altTxt: produit.altTxt,
      });
    }
  });

  afficherProduit(panier);
  modifierQuantite();
  supprimerProduit();
}

function afficherProduit(panier) {
  const produitPanier = document.querySelector("#cart__items");
  produitPanier.innerHTML += panier
    .map(
      (achat) => `
    <article class="cart__item" data-id="${achat.id}" data-color="${
        achat.color
      }" data-quantity="${achat.quantity}" data-price="${achat.price}">
      <div class="cart__item__img">
        <img src="${achat.imageUrl}" alt="${achat.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${achat.name}</h2>
          <p>Couleur : ${achat.color}</p>
          <p>Prix : ${
            achat.price ? achat.price + " €" : "Prix indisponible"
          }</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" data-id="${
              achat.id
            }" data-color="${achat.color}" value="${
        achat.quantity
      }" min="1" max="100">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${achat.id}" data-color="${
        achat.color
      }">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
    )
    .join("");
  totauxPanier();
}

document.querySelectorAll(".itemQuantity").forEach((input) => {
  input.addEventListener("change", (e) => {
    let panier = JSON.parse(localStorage.getItem("Produit")) || [];

    let produitModifie = panier.find(
      (produit) =>
        produit.id === input.dataset.id && produit.color === input.dataset.color
    );

    if (produitModifie) {
      let nouvelleQuantite = parseInt(e.target.value);
      if (nouvelleQuantite > 100) {
        alert("La quantité maximale est 100");
        nouvelleQuantite = 100;
      } else if (nouvelleQuantite < 1) {
        alert("La quantité minimale est 1");
        nouvelleQuantite = 1;
      }

      produitModifie.quantity = nouvelleQuantite;
      localStorage.setItem("Produit", JSON.stringify(panier));

      // Met à jour dynamiquement le dataset de l'élément
      let parent = input.closest(".cart__item");
      if (parent) {
        parent.dataset.quantity = nouvelleQuantite;
      }

      totauxPanier(); // Recalcule immédiatement le total
    }
  });
});

function supprimerProduit() {
  document.querySelectorAll(".deleteItem").forEach((button) => {
    button.addEventListener("click", () => {
      let panier = JSON.parse(localStorage.getItem("Produit")) || [];
      panier = panier.filter(
        (item) =>
          !(
            item.id === button.dataset.id && item.color === button.dataset.color
          )
      );
      localStorage.setItem("Produit", JSON.stringify(panier));
      fetchProductsAndDisplayCart();
    });
  });
}

function totauxPanier() {
  let totalProduits = 0;
  let totalPrix = 0;
  const achats = document.querySelectorAll(".cart__item");

  achats.forEach((achat) => {
    let quantite = Math.min(parseInt(achat.dataset.quantity), 100); // Convertir en nombre
    let prix = parseFloat(achat.dataset.price); // Convertir en nombre flottant

    totalProduits += quantite;
    totalPrix += quantite * prix;
  });

  document.getElementById("totalQuantity").textContent = totalProduits;
  document.getElementById("totalPrice").textContent = totalPrix.toFixed(2); // Affichage propre du prix
}

function ecouteFormulaire() {
  document.querySelector("#order").addEventListener("click", submitOrder);
}

function validationChamp(inputId, regex, msgErreurId, message) {
  const input = document.getElementById(inputId);
  const valeur = input.value;
  const msgErreur = document.getElementById(msgErreurId);

  if (!regex.test(valeur)) {
    input.style.backgroundColor = "red";
    input.style.color = "white";
    msgErreur.innerHTML = message;
    msgErreur.style.display = "inherit";
    return false;
  } else {
    msgErreur.style.display = "none";
    input.style.backgroundColor = "green";
    input.style.color = "white";
    return true;
  }
}

document.getElementById("firstName").addEventListener("input", () => {
  validationChamp(
    "firstName",
    /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{3,24}$/i,
    "firstNameErrorMsg",
    "Votre prénom doit comporter entre 3 et 24 lettres"
  );
});

document.getElementById("lastName").addEventListener("input", () => {
  validationChamp(
    "lastName",
    /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{3,24}$/i,
    "lastNameErrorMsg",
    "Votre nom doit comporter entre 3 et 24 lettres"
  );
});

document.getElementById("address").addEventListener("input", () => {
  validationChamp(
    "address",
    /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s'\-]/,
    "addressErrorMsg",
    "Votre adresse ne doit pas comporter de caractères spéciaux"
  );
});

document.getElementById("city").addEventListener("input", () => {
  validationChamp(
    "city",
    /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
    "cityErrorMsg",
    "Votre ville doit comporter uniquement des lettres et certains caractères spéciaux"
  );
});

document.getElementById("email").addEventListener("input", () => {
  validationChamp(
    "email",
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    "emailErrorMsg",
    "Exemple : support@kanap.com"
  );
});

function submitOrder(event) {
  event.preventDefault();
  let panier = JSON.parse(localStorage.getItem("Produit")) || [];
  if (panier.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  let orderData = {
    contact,
    products: panier.map((item) => item.id),
  };

  fetch(`${getApiUrl()}/api/products/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((orderResponse) => {
      localStorage.removeItem("Produit");
      window.location.href = `confirmation.html?orderId=${orderResponse.orderId}`;
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de la commande:", error);
      alert("Erreur lors de la commande");
    });
}
