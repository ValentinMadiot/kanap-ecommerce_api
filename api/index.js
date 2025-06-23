const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");

// 1) OPTIONS pre-flight pour CORS
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// 2) Autorisation CORS dynamique
const whitelist = [
  "http://localhost:8080", // ton backend
  "http://127.0.0.1:5500", // ton front local VS Code live server
  "https://kanap-vm.vercel.app", // front en ligne
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 3) Middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4) Test route
app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur Kanap Backend !");
});

// 5) API routes
app.use("/api/products", productRoutes);

// 6) Port config
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});

module.exports = app;
