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
        price: produit.price,
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
  produitPanier.innerHTML = panier
    .map(
      (achat) => `
    <article class="cart__item" data-id="${achat.id}" data-color="${achat.color}">
      <div class="cart__item__img">
        <img src="${achat.imageUrl}" alt="${achat.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${achat.name}</h2>
          <p>Couleur : ${achat.color}</p>
          <p>Prix : ${achat.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" data-id="${achat.id}" data-color="${achat.color}" value="${achat.quantity}" min="1" max="100">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${achat.id}" data-color="${achat.color}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
    )
    .join("");
  totauxPanier();
}

function modifierQuantite() {
  document.querySelectorAll(".itemQuantity").forEach((input) => {
    input.addEventListener("change", (e) => {
      let panier = JSON.parse(localStorage.getItem("Produit")) || [];
      let produit = panier.find(
        (item) =>
          item.id === e.target.dataset.id &&
          item.color === e.target.dataset.color
      );
      if (produit) {
        produit.quantity = Math.min(100, Math.max(1, parseInt(e.target.value)));
        localStorage.setItem("Produit", JSON.stringify(panier));
        totauxPanier();
      }
    });
  });
}

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
  let panier = JSON.parse(localStorage.getItem("Produit")) || [];
  let totalQuantity = panier.reduce((acc, item) => acc + item.quantity, 0);
  let totalPrice = panier.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalPrice").textContent = totalPrice;
}

function ecouteFormulaire() {
  document.querySelector("#order").addEventListener("click", submitOrder);
}

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

// ecouteFormulaire();

// function getApiUrl() {
//   return window.location.hostname === "kanap-vm.vercel.app"
//     ? "https://kanap-production-d0c8.up.railway.app"
//     : "http://localhost:4200";
// }
// // On récupère des données de l'API via fetch
// fetch(`${getApiUrl()}/api/products/`)
//   // On obtient la réponse de l'API qu'on converti au format JSON
//   .then((res) => res.json())
//   // Les données JSON sont appelées "produits"
//   .then((produits) => {
//     // On exécute la fonction qui fait le liens entre le local storage et l'API
//     recupererDonneesAchat(produits);
//   })
//   .catch((err) => {
//     // Si une erreur se produit => remplace le contenu du titre h1
//     // avec "erreur 404" et renvoi une erreur en console
//     document.querySelector("#cartAndFormContainer").innerHTML =
//       "<h1>erreur 404<h1>";
//     console.log("API => erreur 404 : " + err);
//   });

// function recupererDonneesAchat(produits) {
//   // On récupère les informations (id, nom, couleur) du/des produit(s) ajouté(s) dans notre panier
//   const panier = JSON.parse(localStorage.getItem("Produit"));
//   // Si le panier est vide => Renvoi le message "Votre panier est vide"
//   if (panier === null || panier.length == 0) {
//     document.querySelector("#cartAndFormContainer").innerHTML =
//       "<h1>Votre panier est vide</h1>";
//     // Sinon si le panier n'est pas vide =>
//   } else if (panier != null) {
//     // On fait une boucle sur tous les achats de notre panier =>
//     for (let achat of panier) {
//       // On fait une boucle sur toutes les données d'un produit de l'API =>
//       for (let a = 0, b = produits.length; a < b; a++) {
//         // Si id de l'achat de notre panier est identique à l'id du produit de l'API
//         if (achat.id === produits[a]._id) {
//           // On récupère les données de chaque éléments dont on a besoin
//           achat.name = produits[a].name;
//           achat.price = produits[a].price;
//           achat.imageUrl = produits[a].imageUrl;
//           achat.altTxt = produits[a].altTxt;
//         }
//       }
//     }
//     // On affiche les achats du panier en console
//     console.log("Panier : ", panier);
//     // On appel notre fonction pour afficher les produits du panier
//     afficherProduit(panier);
//     // On appel nos fonctions pour modifier et supprimer la quantitée des articles
//     modifierQuantite();
//     supprimerProduit();
//   }
// }

// function afficherProduit(panier) {
//   // On déclare et on cible sur quel section du HTML on veut afficher les produits du panier
//   const produitPanier = document.querySelector("#cart__items");
//   // On créer un HTML dynamique avec la méthode .map() + introduction de data-set
//   produitPanier.innerHTML += panier
//     .map(
//       (achat) =>
//         `<article class="cart__item" data-id="${achat.id}" data-color="${achat.color}" data-quantity="${achat.quantity}" data-price="${achat.price}">
//       <div class="cart__item__img">
//         <img src="${achat.imageUrl}" alt="${achat.altTxt}">
//       </div>
//       <div class="cart__item__content">
//         <div class="cart__item__content__description">
//           <h2>${achat.name}</h2>
//           <span>Couleur : ${achat.color}</span>
//           <p data-price="${achat.price}">Prix : ${achat.price} €</p>
//         </div>
//         <div class="cart__item__content__settings">
//           <div class="cart__item__content__settings__quantity">
//             <p>Quantité : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${achat.quantity}">
//           </div>
//           <div class="cart__item__content__settings__delete">
//           <p class="deleteItem" data-id="${achat.id}" data-color="${achat.color}">Supprimer</p>
//           </div>
//         </div>
//       </div>
//     </article>`
//     )
//     .join("");
//   // On appel la fonction pour afficher les totaux (Quantité + Prix article)
//   totauxPanier();
// }

// function modifierQuantite() {
//   // On déclare et on cible tous les éléments avec la classe ".cart__item"
//   const produitPanier = document.querySelectorAll(".cart__item");
//   // De façon dynamique graçe au dataset =>
//   // On écoute les évènements (eQuantite) sur chaque input d'article concerné
//   produitPanier.forEach((achat) => {
//     achat.addEventListener("change", (eQuantite) => {
//       // On appel les ressources de notre "panier" (local storage)
//       const panier = JSON.parse(localStorage.getItem("Produit"));
//       // On fait une boucle sur les produits du Panier
//       for (produit of panier) {
//         if (
//           // Si ( id + color ) sont similaires
//           produit.id === achat.dataset.id &&
//           achat.dataset.color === produit.color
//         ) {
//           // Si la valeure est supérieur à 100 =>
//           // On envoi un message et on remplace la valeur par 100
//           if (eQuantite.target.value > 100) {
//             alert("Vous avez dépassé la quantité limite");
//             eQuantite.target.value = 100;
//           }
//           // Si la valeur est négative =>
//           // On envoi un message et on remplace la valeur par 1
//           else if (eQuantite.target.value < 0) {
//             alert("La quantité minimum est : 1");
//             eQuantite.target.value = 1;
//           }
//           // On envoi les nouvelles données au local storage
//           localStorage.Produit = JSON.stringify(panier);
//           // On fait une mise à jour du dataset quantity
//           achat.dataset.quantity = eQuantite.target.value;
//           // On appel la fonction des "totauxPanier" dynamiquement
//           totauxPanier();
//         }
//       }
//     });
//   });
// }

// function supprimerProduit() {
//   // On déclare et on cible tous les éléments ".cart__item .deleteItem"
//   const supprimerProduit = document.querySelectorAll(".cart__item .deleteItem");
//   // Pour chaque produit
//   supprimerProduit.forEach((produit) => {
//     // On écoute au click (bouton "Supprimer") sur le produit concerné
//     produit.addEventListener("click", () => {
//       // On appel les ressources de notre "panier" (local storage)
//       const panier = JSON.parse(localStorage.getItem("Produit"));
//       // On fait une boucle pour chaque élément du panier
//       for (let a = 0, b = panier.length; a < b; a++) {
//         if (
//           // Si les éléments du panier correspondent au données dataset ( id + color )
//           panier[a].id === produit.dataset.id &&
//           panier[a].color === produit.dataset.color
//         ) {
//           // On déclare une variable utile pour la suppression
//           const num = [a];
//           // On supprime 1 élément à l'indice num
//           panier.splice(num, 1);
//           // On renvoi un nouveau panier converti dans le Local Storage
//           localStorage.Produit = JSON.stringify(panier);
//           // On supprime l'Affichage HTML
//           const displayToDelete = document.querySelector(
//             `article[data-id="${produit.dataset.id}"][data-color="${produit.dataset.color}"]`
//           );
//           displayToDelete.remove();
//           // Si le Panier est vide
//           if (panier === null || panier.length == 0) {
//             // On vide le local storage
//             window.localStorage.clear();
//             // On affiche l'information "Votre panier est vide"
//             document.querySelector("#cartAndFormContainer").innerHTML =
//               "<h1>Votre panier est vide</h1>";
//           }
//         }
//       }
//     });
//   });
// }

// function totauxPanier() {
//   // On déclare des variables de "Total" en tant que nombre
//   let totalProduits = 0;
//   let totalPrix = 0;
//   // On déclare et on cible toutes les classes ".cart__item"
//   const achats = document.querySelectorAll(".cart__item");
//   // Pour chaque élément (achat) des achats
//   achats.forEach((achat) => {
//     // On récupère les quantités des produits via les dataset
//     totalProduits += JSON.parse(Math.min(achat.dataset.quantity, 100));
//     // On calcul le prix panier total via les dataset
//     totalPrix += Math.min(achat.dataset.quantity, 100) * achat.dataset.price;
//   });
//   // On affiche les résultats dans le HTML
//   document.getElementById("totalQuantity").textContent = totalProduits;
//   document.getElementById("totalPrice").textContent = totalPrix;
// }

// function ecouteFormulaire() {
//   // On cible le bouton "Commander !"
//   const boutonCommander = document.getElementById("orderId");
//   // On écoute le bouton et au click => On appel la fonction "envoiFormulaire"
//   boutonCommander.addEventListener("click", (e) => envoiFormulaire(e));

//   // On cible l'input de la saisie
//   let prenomFormulaire = document.getElementById("firstName");
//   // On écoute l'événement à l'input avec la fonction qui vérifie la validité de la saisie
//   prenomFormulaire.addEventListener("input", validationPrenom);

//   let nomFormulaire = document.getElementById("lastName");
//   nomFormulaire.addEventListener("input", validationNom);

//   let adresseFormulaire = document.getElementById("address");
//   adresseFormulaire.addEventListener("input", validationAdresse);

//   let villeFormulaire = document.getElementById("city");
//   villeFormulaire.addEventListener("input", validationVille);

//   let emailFormulaire = document.getElementById("email");
//   emailFormulaire.addEventListener("input", validationEmail);
// }

// function envoiFormulaire(e) {
//   e.preventDefault();
//   // On récupère les données du client
//   const client = donneeClient(e);
//   // Si les informations sont manquantes, on retourne sans envoyer
//   if (client == null) return;
//   // On envoye l'objet "client" qui contient toutes les données à l'API pour obtenir ID de commande
//   fetch(`${getApiUrl()}/api/products/order`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(client),
//   })
//     .then((res) => {
//       console.log("🟢 Réponse reçue du serveur :", res);
//       return res.json();
//     })
//     .then((res) => {
//       console.log("✅ Réponse de l'API :", res);
//       if (res.orderId) {
//         console.log("🔄 Redirection vers confirmation.html...");
//       } else {
//         console.error("❌ L'API n'a pas renvoyé d'orderId !");
//       }
//       alert("Votre commande a bien été effectuée !");
//       window.location.replace(`./confirmation.html?orderId=${res.orderId}`);
//     })
//     .catch((err) => {
//       console.error("❌ Erreur lors de la commande :", err);
//       alert("Erreur lors de la commande : " + err.message);
//     });
// }

// function donneeClient(e) {
//   // Si tous les éléments du formulaire sont valide, on récupère les données du client
//   if (
//     validationPrenom() &&
//     validationNom() &&
//     validationAdresse() &&
//     validationVille() &&
//     validationEmail()
//   ) {
//     const panier = JSON.parse(localStorage.getItem("Produit"));
//     const prenom = document.getElementById("firstName").value;
//     const nom = document.getElementById("lastName").value;
//     const adresse = document.getElementById("address").value;
//     const ville = document.getElementById("city").value;
//     const email = document.getElementById("email").value;
//     // On récupère les ID des produits du client
//     const produitsIds = [];
//     panier.forEach((produit) => {
//       produitsIds.push(produit.id);
//     });
//     // On créer l'objet pour répondre aux attentes de l'API
//     const informationsClient = {
//       contact: {
//         firstName: prenom,
//         lastName: nom,
//         address: adresse,
//         city: ville,
//         email: email,
//       },
//       products: produitsIds,
//     };
//     return informationsClient;
//     // Sinon on retourne une alerte
//   } else {
//     alert("Le formulaire n'est pas correctement rempli, veuillez réessayer.");
//     // e.preventDefault();
//   }
// }

// function validationPrenom() {
//   let prenomInput = document.getElementById("firstName");
//   let prenomValidation = document.getElementById("firstName").value;
//   let prenomMsgErreur = document.getElementById("firstNameErrorMsg");
//   let commande = document.getElementById("order");

//   const prenomReGex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{3,24}$/i;
//   let prenomResultat = prenomReGex.test(prenomValidation);

//   if (prenomResultat == false) {
//     prenomInput.style.backgroundColor = "red";
//     prenomInput.style.color = "white";
//     prenomMsgErreur.innerHTML =
//       "Votre prénom doit comporter entre 3 et 24 lettres";
//     prenomMsgErreur.style.display = "inherit";
//     commande.disabled = true;
//     return false;
//   } else {
//     prenomMsgErreur.style.display = "none";
//     prenomInput.style.backgroundColor = "green";
//     prenomInput.style.color = "white";
//     commande.disabled = false;
//     return true;
//   }
// }

// function validationNom() {
//   let nomInput = document.getElementById("lastName");
//   let nomValidation = document.getElementById("lastName").value;
//   let nomMsgErreur = document.getElementById("lastNameErrorMsg");

//   const nomReGex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{3,24}$/i;
//   let nomResultat = nomReGex.test(nomValidation);

//   if (nomResultat == false) {
//     nomInput.style.backgroundColor = "red";
//     nomInput.style.color = "white";
//     nomMsgErreur.innerHTML = "Votre nom doit comporter entre 3 et 24 lettres";
//     nomMsgErreur.style.display = "inherit";
//     return false;
//   } else {
//     nomMsgErreur.style.display = "none";
//     nomInput.style.backgroundColor = "green";
//     nomInput.style.color = "white";
//     return true;
//   }
// }

// function validationAdresse() {
//   let adresseInput = document.getElementById("address");
//   let adresseValidation = document.getElementById("address").value;
//   let adresseMsgErreur = document.getElementById("addressErrorMsg");

//   const adresseRGEX = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s\''\-]/;
//   let adresseResultat = adresseRGEX.test(adresseValidation);

//   if (adresseResultat == false) {
//     adresseInput.style.backgroundColor = "red";
//     adresseInput.style.color = "white";
//     adresseMsgErreur.innerHTML =
//       "Votre adresse ne doit pas comporter de caractères spéciaux";
//     adresseMsgErreur.style.display = "inherit";
//     return false;
//   } else {
//     adresseMsgErreur.style.display = "none";
//     adresseInput.style.backgroundColor = "green";
//     adresseInput.style.color = "white";
//     return true;
//   }
// }

// function validationVille() {
//   let villeInput = document.getElementById("city");
//   let villeValidation = document.getElementById("city").value;
//   let villeMsgErreur = document.getElementById("cityErrorMsg");

//   const villeReGex =
//     /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
//   let villeResultat = villeReGex.test(villeValidation);

//   if (villeResultat == false) {
//     villeInput.style.backgroundColor = "red";
//     villeInput.style.color = "white";
//     villeMsgErreur.innerHTML =
//       "Votre ville doit comporter que des lettres et certains caractères spéciaux";
//     villeMsgErreur.style.display = "inherit";
//     return false;
//   } else {
//     villeMsgErreur.style.display = "none";
//     villeInput.style.backgroundColor = "green";
//     villeInput.style.color = "white";
//     return true;
//   }
// }

// function validationEmail() {
//   let emailInput = document.getElementById("email");
//   let emailValidation = document.getElementById("email").value;
//   let emailMsgErreur = document.getElementById("emailErrorMsg");

//   const emailReGex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//   let emailResultat = emailReGex.test(emailValidation);

//   if (emailResultat == false) {
//     emailInput.style.backgroundColor = "red";
//     emailInput.style.color = "white";
//     emailMsgErreur.innerHTML = "Exemple : support@kanap.com";
//     emailMsgErreur.style.display = "inherit";
//     return false;
//   } else {
//     emailMsgErreur.style.display = "none";
//     emailInput.style.backgroundColor = "green";
//     emailInput.style.color = "white";
//     return true;
//   }
// }
