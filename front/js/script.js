//--------------------------------------------------------------
//* Récupération des données de l'API
//--------------------------------------------------------------
fetch("http://localhost:3000/api/products/")
  //* Passer la réponse au format JSON
  .then((res) => res.json())
  //* Les données JSON sont appelées api
  .then((api) => {
    //* Informations en console sous forme de tableau
    console.table(api)
    //* Retourne l'affichage des produits
    return ajoutProduits(api)
  }
)

//--------------------------------------------------------------
//* Fonction pour récupérer les données de l'api des produits dans une boucle for + les afficher dans l'index 
//* La balise <article> parent de img + h3 + p
//--------------------------------------------------------------
function ajoutProduits(infos) {
  for (let i = 0; i < infos.length; i++) {
    const id = infos[i]._id
    const imageUrl = infos[i].imageUrl
    const altTxt = infos[i].altTxt
    const name = infos[i].name
    const description = infos[i].description
    const image = ajoutImage(imageUrl, altTxt)
    const ancre = ajoutAncre(id)
    const article = ajoutArticle()
    const h3 = ajoutH3(name)
    const p = ajoutParagraphe(description)
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
    ajoutEnfants(ancre, article)
  }
}

//--------------------------------------------------------------
//* Fonction pour créer la balise <a> + l'ID du Produits dans href
//--------------------------------------------------------------
function ajoutAncre(id) {
  const ancre = document.createElement("a")
  ancre.href = "./product.html?id="+ id
  return ancre
}

//--------------------------------------------------------------
//* Fonction pour créer la Section + ID Items
//* La balise <section> parent de la balise <a>
//* La balise <a> parent de la balise <article>
//--------------------------------------------------------------
function ajoutEnfants(ancre, article) {
  const items = document.querySelector("#items")
  items.appendChild(ancre)
  ancre.appendChild(article)
}

//--------------------------------------------------------------
//* Fonction pour créer la balise <article>
//--------------------------------------------------------------
function ajoutArticle() {
  const article = document.createElement("article")
  return article
}

//--------------------------------------------------------------
//* Fonction pour créer la balise <img> + attributs src & alt
//--------------------------------------------------------------
function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

//--------------------------------------------------------------
//* Fonction pour créer la balise <h3> + sa classe
//--------------------------------------------------------------
function ajoutH3(name){
  const h3 = document.createElement("h3")
  h3.textContent = name
  h3.classList.add("productName")
  return h3
}

//--------------------------------------------------------------
//* Fonction pour créer la balise <p> + sa classe
//--------------------------------------------------------------
function ajoutParagraphe(description) {
  const p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p
}