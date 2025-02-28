const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");

console.log(process.env);
console.log("Current directory:", __dirname);

console.log("🛠️ Configuration CORS en cours...");
const corsOptions = {
  origin: ["https://kanap-vm.vercel.app", "http://localhost:4200"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
console.log("✅ CORS configuré avec :", corsOptions);
// index.js

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
