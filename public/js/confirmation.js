orderId();
cacheLocalStorageVide();

function orderId() {
  let orderNumber = document.getElementById("orderId");
  let baseUrl = window.location.href;
  orderNumber.innerHTML = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);
  console.log("🔍 Numéro de commande extrait :", orderId);
}

function cacheLocalStorageVide() {
  const localStorage = window.localStorage;
  console.log("🗑️ Suppression du localStorage...");
  localStorage.clear();
}
