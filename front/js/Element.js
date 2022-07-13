// const a = new Element ("a",{ 
//   classes:[
//     "maClasse",
//     "maClasse2",
//     "maClasse3",
//   ],
//   attributs:{
//     href: "monLien"
//   }
// })

class Element {
  constructor (balise, options = {}) {
    /** @type {HTMLElement} */
    this.element = document.createElement(balise)
    if (options.contenu) {
      this.element.textContent = options.contenu
    } 
    
    if (options.attributs) {
      for (const[attribut, valeur] of Object.entries(options.attributs)) {
        this.element.setAttribute (attribut, valeur)
      }
    }

    if (options.classes) {
      for (const classe of options.classes) {
        this.element.classList.add(classe)
      }
    }

    return this.element
  }
}
const h1 = new Element ("h1", {
  contenu : " Mon Titre ",
  attributs : {
    title : "Mon Info Bulle",
  },
  classes : ["maClasse"]
})
console.log(h1)