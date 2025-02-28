const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch(() => res.status(500).send(new Error("Database error!")));
};

exports.getOneProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.status(404).send(new Error("Product not found!"));
      }
      res.status(200).json(product);
    })
    .catch(() => res.status(500).send(new Error("Database error!")));
};

exports.orderProducts = (req, res) => {
  console.log("📥 Requête POST reçue !");
  console.log("🔹 Corps de la requête :", req.body);

  // Exemple de réponse pour tester
  res.status(201).json({ message: "Commande reçue", orderId: "123456789" });
};

// exports.orderProducts = (req, res, next) => {
//   if (
//     !req.body.contact ||
//     !req.body.contact.firstName ||
//     !req.body.contact.lastName ||
//     !req.body.contact.address ||
//     !req.body.contact.city ||
//     !req.body.contact.email ||
//     !req.body.products
//   ) {
//     return res.status(400).send(new Error("Bad request!"));
//   }

//   let queries = req.body.products.map((productId) => {
//     return Product.findById(productId).then((product) => {
//       if (!product) {
//         throw new Error("Product not found: " + productId);
//       }
//       return product;
//     });
//   });

//   Promise.all(queries)
//     .then((products) => {
//       const orderId = uuidv4();
//       res.status(201).json({
//         contact: req.body.contact,
//         products: products,
//         orderId: orderId,
//       });
//     })
//     .catch((error) => res.status(500).json({ error: error.message }));
// };
