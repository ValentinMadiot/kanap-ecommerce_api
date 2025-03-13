const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");

const corsOptions = {
  origin: ["https://kanap-vm.vercel.app", "http://localhost:4200"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// **Gérer manuellement les requêtes OPTIONS (preflight)**
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.status(204).end();
// });

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
const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});

module.exports = app;
