// On récupère l'URL de la page avec URLSearchParams
const params = new URLSearchParams(window.location.search);
// On y ajoute ID du produit pour récupérer les informations de l'API
const id = params.get("id");
console.log("ID du produit sélectionné :", id);

function getApiUrl() {
  // Vérifie si l'on est en environnement de production (Railway)
  return window.location.hostname === "kanap-vm.vercel.app"
    ? "https://kanap-production-d0c8.up.railway.app"
    : "http://localhost:4200";
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

function creationNomOnglet(nom) {
  const nomProduit = document.querySelector("title");
  nomProduit.textContent = nom + " | Kanap";
}

function creationImage(imageUrl, altTxt) {
  const divImg = document.querySelector(".item__img");
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = altTxt;
  divImg.appendChild(img);
}

function creationTitre(nom) {
  const h1 = document.querySelector("#title");
  h1.textContent = nom;
}

function creationPrix(prix) {
  const montant = document.querySelector("#price");
  montant.textContent = prix;
}

function creationParagraphe(description) {
  const p = document.querySelector("#description");
  p.textContent = description;
}

function creationCouleurs(couleurs) {
  const selectionner = document.querySelector("#colors");
  couleurs.forEach((couleur) => {
    const option = document.createElement("option");
    option.value = couleur;
    option.textContent = couleur;
    selectionner.appendChild(option);
  });
}

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

function ajoutPanier(produit, quantite, couleur) {
  const achat = {
    id: produit._id,
    color: couleur,
    quantity: Number(quantite),
  };

  let panier = JSON.parse(localStorage.getItem("Produit")) || [];

  // Vérifier si le produit existe déjà dans le panier
  let produitExistant = panier.find(
    (item) => item.id === produit._id && item.color === couleur
  );

  if (produitExistant) {
    produitExistant.quantity = Math.min(
      produitExistant.quantity + achat.quantity,
      100
    );
  } else {
    panier.push(achat);
  }

  // Mettre à jour le localStorage
  localStorage.setItem("Produit", JSON.stringify(panier));

  // Confirmation de l'ajout
  confirmationAchat();
}

const confirmationAchat = (message = undefined) => {
  if (message && window.confirm(message)) {
    window.location.href = "cart.html";
  }
};

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
