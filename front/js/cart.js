//*--------------------------------------------------------------
//* Recuperation donnees du local storage -----------------------
//*--------------------------------------------------------------
const panier = JSON.parse(localStorage.getItem("Produit(s)"))
// console.log(panier);

//*--------------------------------------------------------------
//* Recuperation donnees de l'API -------------------------------
//*--------------------------------------------------------------
// fetch("http://localhost:3000/api/products")
//   .then((response) => response.json())
//   .then((produits) => {
//       console.log("Tout les produits de l'API :", produits);
//       ensembleDonneesProduit(produits);
//   })

//*--------------------------------------------------------------
//* Recuperer les donnees panier pour les afficher --------------
//*--------------------------------------------------------------

function verifLocalStorage() {}
if (panier === null || panier.length == 0 ){
  document.querySelector("#cartAndFormContainer").innerHTML = "<h1>Votre panier est vide</h1>"
} else { 
  panier.forEach((produit) => afficherProduit(produit))
}

//*--------------------------------------------------------------
//* Afficher les produits sur la page panier --------------------
//*--------------------------------------------------------------
function afficherProduit(produit) {
  const ajoutArticle = creationArticle(produit)

  const ajoutImage = creationImage(produit)
  const ajoutDivInfo = creationDivInfos(produit)
  
  afficherArticle(ajoutArticle)
  ajoutArticle.appendChild(ajoutImage)  
  ajoutArticle.appendChild(ajoutDivInfo)
  
  afficherTotalQuantite()
  afficherTotalPrix()
}

//*--------------------------------------------------------------
//* Afficher l'article ------------------------------------------
//*--------------------------------------------------------------
function afficherArticle (article) {
  document.querySelector("#cart__items").appendChild(article)
}

//*--------------------------------------------------------------
//* Création de l'article ---------------------------------------
//*--------------------------------------------------------------
function creationArticle(produit) {
  const article = document.createElement("article")
  article.classList.add("cart__item")
  article.dataset.id = produit.id
  article.dataset.color = produit.color
  return article
}

//*--------------------------------------------------------------
//* Création de l'image -----------------------------------------
//*--------------------------------------------------------------
function creationImage(produit) {  
  const divImg = document.createElement("div")
  divImg.classList.add("cart__item__img")

  const img = document.createElement("img")
  img.src = produit.imageUrl
  img.alt = produit.altTxt

  divImg.appendChild(img)

  return divImg
}

//*--------------------------------------------------------------
//* Création div qui englobe les infos produit + les paramètres -
//*--------------------------------------------------------------
function creationDivInfos(produit) {
  const divDescription = document.createElement("div")
  divDescription.classList.add("cart__item__content")

  const description = creationInfo(produit)
  const parametre = creationDivParametres(produit)

  divDescription.appendChild(description)
  divDescription.appendChild(parametre)
  return divDescription
}

//*--------------------------------------------------------------
//* Création infos produit --------------------------------------
//*--------------------------------------------------------------
function creationInfo(produit) {
  const description = document.createElement("div")
  description.classList.add("cart__item__content__description")
  
  const h2 = document.createElement("h2")
  h2.textContent = produit.nom
  const color = document.createElement("p")
  color.textContent = produit.couleur
  const p = document.createElement("p")
  p.textContent = produit.prix + " €"
  
  description.appendChild(h2)
  description.appendChild(color)
  description.appendChild(p)
  return description
}

//*--------------------------------------------------------------
//* Création div paramètres -------------------------------------
//*--------------------------------------------------------------
function creationDivParametres(produit) {
  const divParametres = document.createElement("div")
  divParametres.classList.add("cart__item__content__settings")

  ajoutQuantite(divParametres, produit)
  supprimerQuantite(divParametres, produit)
  return divParametres
}

//*--------------------------------------------------------------
//* Création d'une fonction pour voir la quantitée du produit ---
//*--------------------------------------------------------------
function ajoutQuantite(settings, produit) {
  const parametre = document.createElement("div")
  parametre.classList.add("cart__item__content__settings__quantity")
  
  const quantite = document.createElement("p")
  quantite.textContent = "Qté : "
  parametre.appendChild(quantite)
  
  const input = document.createElement("input")
  input.type = "number"
  input.classList.add("itemQuantity")
  input.name = "itemQuantity"
  input.min = "1"
  input.max = "100"
  input.value = produit.quantite

  parametre.appendChild(input)
  settings.appendChild(parametre)
  
  input.addEventListener("input", () => majQuantite(produit, produit.id, produit.couleur, input.value))
}

//*--------------------------------------------------------------
//* Création bouton pour supprimer la quantitée --------------------
//*--------------------------------------------------------------
function supprimerQuantite(settings, produit) {
  const supprimer = document.createElement("div")
  supprimer.classList.add("cart__item__content__settings__delete")
  
  supprimer.addEventListener("click", () => supprimerArticle(produit))
  const boutonSupprimer = document.createElement("p")
  boutonSupprimer.classList.add("deleteItem")
  boutonSupprimer.textContent = "Supprimer"

  supprimer.appendChild(boutonSupprimer)
  settings.appendChild(supprimer)
}

//*--------------------------------------------------------------
//* Supprimer l'article de la page ------------------------------
//*--------------------------------------------------------------
function supprimerArticle (produit) {
  const objetSupprimer = panier.findIndex(
    (product) => product.id === produit.id && product.couleur === produit.couleur)
  panier.splice(objetSupprimer, 1)
  localStorage.setItem("Produit(s)", JSON.stringify(panier))
  
  if (panier == 0) {
    localStorage.clear()
  }
  location.reload()
}

//*--------------------------------------------------------------
//* Mise à jour de la quantitée ---------------------------------
//*--------------------------------------------------------------
function majQuantite(produit, id, couleur, nouvelleValeur) {
  const nouvelleQuantite = panier.find((produit) => produit.id === id && produit.couleur === couleur) 
  nouvelleQuantite.quantite = Number(nouvelleValeur)

  afficherTotalQuantite()
  afficherTotalPrix()
  majLocalStorage(produit)
}

//*--------------------------------------------------------------
//* Mise à jour dans le local storage ---------------------------
//*--------------------------------------------------------------
function majLocalStorage() {
  const dataToSave = JSON.stringify(panier)
  localStorage.setItem("Produit(s)", dataToSave)
}

//*--------------------------------------------------------------
//* Création total produit --------------------------------------
//*--------------------------------------------------------------
function afficherTotalQuantite() {
  const afficherTotalQuantite= document.querySelector("#totalQuantity")
  
  let total = 0
  
  panier.forEach((produit) => {
    const totalUnitQuantite = produit.quantite
    produit.quantite = Math.min(produit.quantite, 100)
    total += totalUnitQuantite 
  })
  afficherTotalQuantite.textContent = total
}

//*--------------------------------------------------------------
//* Création prix total produit ---------------------------------
//*--------------------------------------------------------------
function afficherTotalPrix() {
  const afficherTotalPrix = document.querySelector("#totalPrice")
  
  // let total = 0 
  // panier.forEach((produit) => {
  //   const totalPrixUnite = produit.prix * produit.quantite
  //   total += totalPrixUnite 
  // })
  //=============================================================
  const total = panier.reduce((total, produit) => total + produit.prix * produit.quantite, 0)

  afficherTotalPrix.textContent = total
}