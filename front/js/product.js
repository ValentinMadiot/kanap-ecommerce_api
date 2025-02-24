//*-------------------------------------------------------------------------
//*--------- Récupération des données de l'API via l'ID du produit ---------
//*-------------------------------------------------------------------------
// On récupère l'URL de la page avec URLSearchParams
const params = new URLSearchParams(window.location.search);
// On y ajoute ID du produit pour récupérer les informations de l'API
const id = params.get("id");
console.log("ID du produit sélectionné :", id);

//*-------------------------------------------------------------------------
//*--- Récupération des données de l'API via l'ID du produit sélectionné ---
//*-------------------------------------------------------------------------
function getApiUrl() {
  // Vérifie si l'on est en environnement de production (Railway)
  window.location.hostname === "kanap-production-d0c8.up.railway.app";
  return "https://kanap-production-d0c8.up.railway.app";
}
// On récupère les données de l'API via l'ID du produit sélectionné
fetch(`${getApiUrl()}/api/products/${id}`)
  // On obtient la réponse de l'API qu'on converti au format JSON
  .then((res) => res.json())
  // Les données JSON sont appelées "produit"
  .then((produit) => {
    // On affiche les données du produit en console
    console.log("Données du produit sélectionné :", produit);
    // On execute la fonction qui affiche le produit
    afficherProduit(produit);
  })
  // Si une erreur se produit => remplace le contenu de la section "item"
  // par un titre h1 avec erreur 404 et renvoi une erreur en console
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404<h1>";
    console.log("API => erreur 404 : " + err);
  });

//*-------------------------------------------------------------------------
//*-------------------- Afficher les données du produit --------------------
//*-------------------------------------------------------------------------
// On appel les fonctions créées avec en paramètre les données API à afficher
function afficherProduit(produit) {
  creationNomOnglet(produit.name);
  creationImage(produit.imageUrl, produit.altTxt);
  creationTitre(produit.name);
  creationPrix(produit.price);
  creationParagraphe(produit.description);
  creationCouleurs(produit.colors);
  creationPanier(produit);
}

//*-------------------------------------------------------------------------
//*----------- Créer le nom du produit dans l'onglet navigateur ------------
//*-------------------------------------------------------------------------
function creationNomOnglet(nom) {
  const nomProduit = document.querySelector("title");
  nomProduit.textContent = nom + " | Kanap";
}

//*-------------------------------------------------------------------------
//*----------------------- Créer l'image du produit ------------------------
//*-------------------------------------------------------------------------
function creationImage(imageUrl, altTxt) {
  const divImg = document.querySelector(".item__img");
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = altTxt;
  divImg.appendChild(img);
}

//*-------------------------------------------------------------------------
//*----------------------- Créer le titre du produit -----------------------
//*-------------------------------------------------------------------------
function creationTitre(nom) {
  const h1 = document.querySelector("#title");
  h1.textContent = nom;
}

//*-------------------------------------------------------------------------
//*----------------------- Créer le prix du produit ------------------------
//*-------------------------------------------------------------------------
function creationPrix(prix) {
  const montant = document.querySelector("#price");
  montant.textContent = prix;
}

//*-------------------------------------------------------------------------
//*-------------------- Créer le paragraphe du produit ---------------------
//*-------------------------------------------------------------------------
function creationParagraphe(description) {
  const p = document.querySelector("#description");
  p.textContent = description;
}

//*-------------------------------------------------------------------------
//*--------------- Créer les options de couleurs du produit ----------------
//*-------------------------------------------------------------------------
function creationCouleurs(couleurs) {
  const selectionner = document.querySelector("#colors");
  couleurs.forEach((couleur) => {
    const option = document.createElement("option");
    option.value = couleur;
    option.textContent = couleur;
    selectionner.appendChild(option);
  });
}

//*-------------------------------------------------------------------------
//*------------- Créer un ou plusieurs produit dans le panier --------------
//*-------------------------------------------------------------------------
function creationPanier(produit) {
  // On écoute la réponse du boutton au clique de l'utilisateur
  const button = document.querySelector("#addToCart");
  button.addEventListener("click", () => {
    // On récupère les valeurs des Input de #colors et #quantity
    const couleur = document.querySelector("#colors").value;
    const quantite = document.querySelector("#quantity").value;
    // Si l'achat est invalide on retourne l'information
    if (AchatInvalide(couleur, quantite)) return;
    // Autrement on ajoute les informations séléctionnées par l'utilisateur
    ajoutPanier(produit, quantite, couleur);
    // On affiche un message pour rediriger l'utilisateur après avoir validé sa sélection
    const message = `Le ${produit.name} avec la couleur ${couleur} a bien été ajouté au panier !
    Consuler le Panier [OK] | Rester sur la page ${produit.name} [Annuler]`;
    confirmationAchat(message);
  });
  // On retourne les informations saisie dans le local storage
  return (panier = JSON.parse(localStorage.getItem("Produit")));
}

//*-------------------------------------------------------------------------
//*-------------- Condition pour ajouter un article au panier --------------
//*-------------------------------------------------------------------------
function ajoutPanier(produit, quantite, couleur) {
  // Les informations sont stockés sous forme d'objet dans le local storage
  const achat = {
    id: produit._id,
    color: couleur,
    quantity: Number(quantite),
  };
  // On créer une variable panier avec comme clé "Produit" dans le local storage
  let panier = JSON.parse(localStorage.getItem("Produit"));
  // Si le panier est vide => création d'un tableau + push du 1er produit
  if (panier == null) {
    panier = [];
    panier.push(achat);
    localStorage.setItem("Produit", JSON.stringify(panier));
    // Confirme l'ajout au panier
    confirmationAchat();
    // Sinon le panier n'est pas vide => ...
  } else {
    // On fait une boucle sur les éléments panier
    for (i = 0; i < panier.length; i++) {
      // Si le produit est similaire (id/couleur) => Ajout de quantité
      if (panier[i].id == produit._id && panier[i].color == couleur) {
        return (
          // Math.min renvoie la plus petite des 2 valeurs, pas plus de 100
          (panier[i].quantity = Math.min(
            panier[i].quantity + achat.quantity,
            100
          )),
          localStorage.setItem("Produit", JSON.stringify(panier)),
          // Confirme l'ajout au panier
          confirmationAchat()
        );
      }
    }
    // On fait une boucle sur les éléments panier
    for (i = 0; i < panier.length; i++) {
      // Si le produit à (un ID similaire ET une couleur différente) OU un ID différent
      if (
        (panier[i].id == produit._id && panier[i].color != couleur) ||
        panier[i].id != produit._id
      ) {
        return (
          // Ajouter un nouveau produit dans le panier
          panier.push(achat),
          localStorage.setItem("Produit", JSON.stringify(panier)),
          // Confirme l'ajout au panier
          confirmationAchat()
        );
      }
    }
  }
}

//*-------------------------------------------------------------------------
//*--------------- Confirme et redirige après l'ajout panier ---------------
//*-------------------------------------------------------------------------
const confirmationAchat = (message = undefined) => {
  // Si l'utilisateur clique sur OK => Redirigé sur la page panier
  if (message && window.confirm(message)) {
    window.location.href = "cart.html";
    // Si l'utilisateur clique sur ANNULER => Reste sur la page du produit
  } else {
    window.close;
  }
};

//*-------------------------------------------------------------------------
//*------------------------- Alerte achat invalide -------------------------
//*-------------------------------------------------------------------------
function AchatInvalide(couleur, quantite) {
  // Si aucune couleur ET/OU quantité est séléctionné => alerte
  if (couleur == 0 || quantite == 0) {
    alert("Veuillez choisir une couleur et une quantité");
    return true;
  }
  // Si une quantitée < 0 est écrite OU Si une quantitée > 100 est écrite => alerte
  if (quantite <= 0 || quantite >= 100) {
    alert("Veuillez rentrer une valeur entre 1 et 100");
    return true;
  }
  return false;
}
