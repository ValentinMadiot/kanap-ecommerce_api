//*--------------------------------------------------------------
//* Récupère les données de l'API -------------------------------
//*--------------------------------------------------------------
fetch("http://localhost:3000/api/products/")
  //* Passe la réponse au format JSON
  .then((res) => res.json())
  //* Les données JSON sont appelées api
  .then((api) => {
    //* Informations en console sous forme de tableau
    // console.table(api)
    //* Retourne l'affichage des produits
    return afficherProduits(api)
  }
)

//*--------------------------------------------------------------
//* Récupère les données de l'api à l'aide d'une boucle for -----
//* Affiche les différents produits de l'API dans l'index -------
//* La balise <a> parent de la balise <article> -----------------
//* La balise <article> parent des balises [<img> + <h3> + <p>] -
//*--------------------------------------------------------------
function afficherProduits(infos) {
  for (let i = 0; i < infos.length; i++) {
    const ancre = creationAncre(infos[i]._id)
    const image = creationImage(infos[i].imageUrl, infos[i].altTxt)
    const article = creationArticle()
    const h3 = creationH3(infos[i].name)
    const p = creationParagraphe(infos[i].description)
    
    creationEnfants(ancre, article, [image, h3, p])
  }
}

//*--------------------------------------------------------------
//* Créer la balise <a> + l'ID du Produits dans href ------------
//*--------------------------------------------------------------
function creationAncre(id) {
  const ancre = document.createElement("a")
  ancre.href = "./product.html?id="+ id
  return ancre
}

//*--------------------------------------------------------------
//* Identifier la Section avec son ID Items ---------------------
//* La balise <section> parent de la balise <a> -----------------
//* La balise <a> parent de la balise <article> -----------------
//* La balise <article> parent des balises [<img> + <h3> + <p>] -
//*--------------------------------------------------------------
function creationEnfants(ancre, article, array) {
  const items = document.querySelector("#items")
  items.appendChild(ancre)
  ancre.appendChild(article)
  array.forEach(elements => {
    article.appendChild(elements)
  });
}

//*--------------------------------------------------------------
//* Créer la balise <article> -----------------------------------
//*--------------------------------------------------------------
function creationArticle() {
  const article = document.createElement("article")
  return article
}

//*--------------------------------------------------------------
//* Créer la balise <img> + les attributs src & alt -------------
//*--------------------------------------------------------------
function creationImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

//*--------------------------------------------------------------
//* Créer la balise <h3> + sa classe ----------------------------
//*--------------------------------------------------------------
function creationH3(name) {
  const h3 = document.createElement("h3")
  h3.textContent = name
  h3.classList.add("productName")
  return h3
}

//*--------------------------------------------------------------
//* Créer la balise <p> + sa classe -----------------------------
//*--------------------------------------------------------------
function creationParagraphe(description) {
  const p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p
}