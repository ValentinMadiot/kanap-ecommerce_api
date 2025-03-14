document.addEventListener("DOMContentLoaded", () => {
  showOrderId();
  clearLocalStorage();
});

function showOrderId() {
  let orderNumberElement = document.getElementById("orderId");
  let baseUrl = window.location.href;
  let extractedOrderId = baseUrl.substring(baseUrl.lastIndexOf("=") + 1);

  console.log("🔍 Numéro de commande extrait :", extractedOrderId);

  if (orderNumberElement && extractedOrderId) {
    orderNumberElement.innerText = extractedOrderId;
  } else {
    console.error("❌ Impossible d'afficher le numéro de commande !");
  }
}

function clearLocalStorage() {
  console.log("🗑️ Suppression du localStorage...");
  setTimeout(() => {
    localStorage.clear();
    console.log("✅ LocalStorage effacé !");
  });
}
