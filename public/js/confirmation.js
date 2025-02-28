orderId();
cacheLocalStorageVide();

function orderId() {
  let orderNumberElement = document.getElementById("orderId");
  let baseUrl = window.location.href;
  let orderId = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);

  console.log("🔍 Numéro de commande extrait :", orderId);

  if (orderNumberElement) {
    orderNumberElement.innerHTML = orderId;
  } else {
    console.error("❌ Élément #orderId introuvable dans le DOM !");
  }
}

function cacheLocalStorageVide() {
  const localStorage = window.localStorage;
  console.log("🗑️ Suppression du localStorage...");
  localStorage.clear();
}
