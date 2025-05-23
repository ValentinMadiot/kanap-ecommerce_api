function getApiUrl() {
  const hostname = window.location.hostname;
  // Si on est en local (Live Server ou localhost)
  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return "http://localhost:4200"; // URL de l'API en local
  }
  return "https://kanap-ecommerce-api.onrender.com";
}

// On récupère des données de l'API via fetch
fetch(`${getApiUrl()}/api/products/`)
  // On obtient la réponse de l'API qu'on convertit au format JSON
  .then((res) => res.json())
  // Les données JSON sont appelées "produits"
  .then((produits) => {
    // Informations sur les produits en console sous forme de tableau
    console.table(produits);
    // On retourne l'affichage des produits avec la fonction "afficherProduits"
    afficherProduits(produits);
  })
  // Si une erreur se produit => On remplace le contenu du titre h1
  // avec "erreur 404" et on renvoie une erreur en console
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("API => erreur 404 : " + err);
  });

function afficherProduits(produits) {
  // On déclare une variable qui cible l'ID de la section "#items"
  const tousLesProduits = document.querySelector("#items");

  // On fait une boucle pour chaque indice "produit" des "produits" de l'API
  for (const produit of produits) {
    // Création de : a > article > img + h3 + p avec les valeurs dynamiques de l'API
    tousLesProduits.innerHTML += `<a href="./product.html?id=${produit._id}">
      <article>
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">
        <h3 class="productName">${produit.name}</h3>
        <p class="productDescription">${produit.description}</p>
      </article>
    </a>`;
  }
}
