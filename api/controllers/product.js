const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");

exports.getAllProducts = (req, res) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch(() => res.status(500).send(new Error("Database error!")));
};

exports.getOneProduct = (req, res) => {
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
  console.log("📥 Requête POST reçue :", req.body);

  if (
    !req.body.contact ||
    !req.body.contact.firstName ||
    !req.body.contact.lastName ||
    !req.body.contact.address ||
    !req.body.contact.city ||
    !req.body.contact.email ||
    !req.body.products
  )
    return res.status(400).send(new Error("Bad request!"));

  const orderId = uuidv4();
  res.status(201).json({ orderId });
};
