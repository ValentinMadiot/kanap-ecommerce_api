
//* Appel les ressources de l'API 
fetch("http://localhost:3000/api/products/")
  .then((res) => res.json())
  .then((api) => console.log(api))