//*-------------------------------------------------------------------------
//*------------------- Récupération des données de l'API -------------------
//*-------------------------------------------------------------------------
fetch("http://localhost:3000/api/products/")
  // Ecrit la réponse de l'API au format JSON
  .then((res) => res.json())
  // Les données JSON sont appelées "produits"
  .then((produits) => {
    // Informations sur les produits en console sous forme de tableau
    console.table(produits)
    // Retourne l'affichage des produits
    afficherProduits(produits)
  })
  // Si une erreur se produit => remplace le contenu du titre h1  
  // avec "erreur 404" et renvoi une erreur en console
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404<h1>"
    console.log("API => erreur 404 : " + err)
  })

//!=========================================================================
//!=============================== METHODE 1 ===============================
//!=========================================================================
//*-------------------------------------------------------------------------
//*-------------------- Afficher les produits de l'API ---------------------
//*-------------------------------------------------------------------------
function afficherProduits(produit) {
  // Récupère toutes les données des produits de l'API avec une boucle for
  for (let i = 0; i < produit.length; i++) {
    // Appel les fonctions créées avec en paramètre les données API à afficher
    const ancre = creationAncre(produit[i]._id)
    const image = creationImage(produit[i].imageUrl, produit[i].altTxt)
    const article = creationArticle()
    const h3 = creationH3(produit[i].name)
    const p = creationParagraphe(produit[i].description)
    
    // La balise <a> parent de <article> parent des balises [<img> + <h3> + <p>] 
    creationEnfants(ancre, article, [image, h3, p])
  }
}

//*-------------------------------------------------------------------------
//*----------- Créer la balise <a> + l'ID du Produits dans href ------------
//*-------------------------------------------------------------------------
function creationAncre(id) {
  const ancre = document.createElement("a")
  ancre.href = "./product.html?id="+ id
  return ancre
}

//*-------------------------------------------------------------------------
//*----------------- Créer les liaisons parents => enfants -----------------
//*-------------------------------------------------------------------------
function creationEnfants(ancre, article, array) {
  const items = document.querySelector("#items")
  items.appendChild(ancre)
  ancre.appendChild(article)
  array.forEach(elements => {
    article.appendChild(elements)
  });
}

//*-------------------------------------------------------------------------
//*----------------------- Créer la balise <article> -----------------------
//*-------------------------------------------------------------------------
function creationArticle() {
  const article = document.createElement("article")
  return article
}

//*-------------------------------------------------------------------------
//*------------ Créer la balise <img> + les attributs src & alt ------------
//*-------------------------------------------------------------------------
function creationImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

//*-------------------------------------------------------------------------
//*------------------- Créer la balise <h3> + sa classe --------------------
//*-------------------------------------------------------------------------
function creationH3(name) {
  const h3 = document.createElement("h3")
  h3.textContent = name
  h3.classList.add("productName")
  return h3
}

//*-------------------------------------------------------------------------
//*-------------------- Créer la balise <p> + sa classe --------------------
//*-------------------------------------------------------------------------
function creationParagraphe(description) {
  const p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p
}

// !=========================================================================
// !=============================== METHODE 2 ===============================
// !=========================================================================
// *-------------------------------------------------------------------------
// * ----------- Afficher les produits de l'api sur la page index -----------
// *-------------------------------------------------------------------------
// function afficherProduits(produits) {
//   // Déclarer une variable qui identifie la section avec l'id "#items"
//   const tousLesProduits = document.querySelector("#items");
//   // Boucle pour chaque indice "produit" de "produits"
//   for (const produit of produits) {
//     // Création de : a > article > img + h3 + p avec les valeurs dynamique de l'API
//     tousLesProduits.innerHTML += 
//     `<a href="./product.html?_id=${produit._id}">
//       <article>
//         <img src="${produit.imageUrl}" alt="${produit.altTxt}">
//         <h3 class="productName">${produit.name}</h3>
//         <p class="productDescription">${produit.description}</p>
//       </article>
//     </a>`;
//   }
// }