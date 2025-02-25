//*-------------------------------------------------------------------------
//*------------------------- Appels les fonctions --------------------------
//*-------------------------------------------------------------------------
orderId()
cacheLocalStorageVide()

//*-------------------------------------------------------------------------
//*--------------------- Récupérer et afficher orderId ---------------------
//*-------------------------------------------------------------------------
function orderId () {
  let orderNumber = document.getElementById("orderId")
  let baseUrl = (window.location).href
  orderNumber.innerHTML = baseUrl.substring(baseUrl.lastIndexOf('=') + 1)
  console.log("Numéro de commande :", orderNumber);
}

//*-------------------------------------------------------------------------
//*----------------------- Supprimer fichier panier ------------------------
//*-------------------------------------------------------------------------
function cacheLocalStorageVide () {
  const localStorage = window.localStorage
  localStorage.clear()
}