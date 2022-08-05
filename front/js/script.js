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

// *-------------------------------------------------------------------------
// * ----------- Afficher les produits de l'api sur la page index -----------
// *-------------------------------------------------------------------------
function afficherProduits(produits) {
  // Déclarer une variable qui identifie la section avec l'id "#items"
  const tousLesProduits = document.querySelector("#items");
  // Boucle pour chaque indice "produit" de "produits"
  for (const produit of produits) {
    // Création de : a > article > img + h3 + p avec les valeurs dynamique de l'API
    tousLesProduits.innerHTML += 
    `<a href="./product.html?_id=${produit._id}">
      <article>
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">
        <h3 class="productName">${produit.name}</h3>
        <p class="productDescription">${produit.description}</p>
      </article>
    </a>`
  }
}