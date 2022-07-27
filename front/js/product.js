//*--------------------------------------------------------------
//* Récupère les données de l'API via l'ID du produit -----------
//*--------------------------------------------------------------
const requete = window.location.search
const urlParams = new URLSearchParams(requete)
const id = urlParams.get("id")

fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((donnees) => afficherProduit(donnees))

//*--------------------------------------------------------------
//* Affiche les caractéristiques du produit ---------------------
//*--------------------------------------------------------------
function afficherProduit(produit) {
  // const {imageUrl, altTxt, name, price, description, colors} = produit
  creationNomOnglet(produit.name)
  creationImage(produit.imageUrl, produit.altTxt)
  creationTitre(produit.name)
  creationPrix(produit.price)
  creationParagraphe(produit.description)
  creationCouleurs(produit.colors)
  creationPanier(produit)
}

//*--------------------------------------------------------------
//* Créer le nom du produit dans l'onglet -----------------------
//*--------------------------------------------------------------
function creationNomOnglet(nom) {
  const nomProduit = document.querySelector('title')
  nomProduit.textContent = nom
}

//*--------------------------------------------------------------
//* Créer l'image du produit ------------------------------------
//*--------------------------------------------------------------
function creationImage(imageUrl, altTxt) {
  const divImg = document.querySelector(".item__img")
  
  const img = document.createElement("img")
  img.src = imageUrl
  img.alt = altTxt

  divImg.appendChild(img)
}

//*--------------------------------------------------------------
//* Créer le titre du produit -----------------------------------
//*--------------------------------------------------------------
function creationTitre(nom) {
  const h1 = document.querySelector("#title")
  h1.textContent = nom
}

//*--------------------------------------------------------------
//* Créer le prix du produit ------------------------------------
//*--------------------------------------------------------------
function creationPrix(prix) {
  const montant = document.querySelector("#price")
  montant.textContent = prix
}

//*--------------------------------------------------------------
//* Créer le paragraphe du produit ------------------------------
//*--------------------------------------------------------------
function creationParagraphe(description) {
  const p = document.querySelector("#description")
  p.textContent = description
}

//*--------------------------------------------------------------
//* Créer les options de couleurs du produit --------------------
//*--------------------------------------------------------------
function creationCouleurs(couleurs) {
  const selectionner = document.querySelector("#colors")
  couleurs.forEach((couleur) => {
    const option = document.createElement("option")
    option.value = couleur
    option.textContent = couleur

    selectionner.appendChild(option)
  });
}

//*--------------------------------------------------------------
//* Créer un ou plusieurs produit dans le panier ----------------
//*--------------------------------------------------------------
function creationPanier(produit) {
  const button = document.querySelector("#addToCart")
  button.addEventListener("click", () => { 
    const couleur = document.querySelector("#colors").value
    const quantite = document.querySelector("#quantity").value
    
    if (AchatInvalide(couleur, quantite)) return
    
    ajoutPanier(produit, quantite, couleur)
    
    const message = `Le ${produit.name} avec la couleur ${couleur} a bien été ajouté au panier !
    Consuler le Panier [OK] | Rester sur la page ${produit.name} [Annuler]`
    confirmationAchat(message)
  })
  return (panier = JSON.parse(localStorage.getItem("Produit(s)")))
}

//*--------------------------------------------------------------
//* Condition pour ajouter un article au panier -----------------
//*--------------------------------------------------------------
function ajoutPanier(produit, quantite, couleur) {
  //* Informations sauvegardés dans le local storage
  const achat = {
    id: produit._id,
    nom: produit.name,
    couleur: couleur,
    quantite: Number(quantite),
    prix: produit.price,
    imageUrl: produit.imageUrl,
    altTxt: produit.altTxt
  }

  //* Variable panier
  let panier = JSON.parse(localStorage.getItem("Produit(s)"))

  //* Si le panier est vide => création d'un tableau => ajout du 1er produit
  if (panier == null) {
    panier = []
    panier.push(achat)
    localStorage.setItem("Produit(s)", JSON.stringify(panier))
    confirmationAchat()
  
  //* Si le panier n'est pas vide => boucle sur panier 
  } else {

    //* Si le produit est similaire (id/couleur) => Ajout de quantité 
    for (i = 0; i < panier.length; i++) {                
      if (panier[i].id == produit._id && panier[i].couleur == couleur) {
        return (
          //* Math.min garde la plus petite des 2 valeurs, pas plus de 100
          panier[i].quantite = Math.min(panier[i].quantite + achat.quantite, 100),
          localStorage.setItem("Produit(s)", JSON.stringify(panier)),
          (panier = JSON.parse(localStorage.getItem("Produit(s)"))),
          confirmationAchat()
        )
      }
    }

    //* Si le produit est similaire (id/couleur) => Ajout d'un nouveau produit dans panier
    for (i = 0; i < panier.length; i++) { 
      if (panier[i].id == produit._id && panier[i].couleur != couleur || panier[i].id != produit._id) {
        return (
          panier.push(achat),
          localStorage.setItem("Produit(s)", JSON.stringify(panier)),
          (panier = JSON.parse(localStorage.getItem("Produit(s)"))),
          confirmationAchat()
        )
      }
    }            
  }
}

//*--------------------------------------------------------------
//* Confirme et redirige après l'ajout panier -------------------
//*--------------------------------------------------------------
const confirmationAchat = (message = undefined) => {
  if (message && window.confirm(message)) {
    window.location.href = "cart.html"
  } else {
    window.close
  }
}

//*--------------------------------------------------------------
//* Alerte achat invalide ---------------------------------------
//*--------------------------------------------------------------
function AchatInvalide(couleur, quantite) {
  // if (couleur == null || couleur === "" || quantite == null || quantite == 0) 
  if (couleur == 0 || quantite == 0) {
    alert (" Veuillez choisir une quantite et une couleur ")
    return true
  }
  if (quantite <= 0) {
    alert ("Veuillez rentrer une valeur positive")
    return true
  }
  if (quantite >= 100) {
    alert ("La limite de l'article est atteinte")
    return true
  }
  return false
}