const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://kanap-vm.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).send();
});

// Middleware pour gérer les requêtes OPTIONS
app.options("*", (req, res) => {
  res.status(200).send();
});

// Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur Kanap Backend !");
});

// Routes API
app.use("/api/products", productRoutes);

// Définition du port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});

module.exports = app;
