const express = require("express");
const router = express.Router();

const productCtrl = require("../controllers/product");

router.get("/", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getOneProduct);
router.post("/order", (req, res, next) => {
  console.log("📥 Requête reçue sur /api/products/order !");
  console.log("🔹 Headers reçus :", req.headers);
  console.log("🔹 Corps de la requête :", req.body);

  router.post("/order", productCtrl.orderProducts);
});

module.exports = router;
