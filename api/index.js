const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");

console.log("🛠️ Configuration CORS en cours...");
const corsOptions = {
  origin: ["https://kanap-vm.vercel.app", "http://localhost:4200"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

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
