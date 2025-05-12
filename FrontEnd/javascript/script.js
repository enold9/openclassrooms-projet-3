const reponse = await fetch("http://localhost:5678/api/works")
const projets = await reponse.json()


const gallerie = document.querySelector(".gallery")

// fonction pour générer la gallerie photo sur la page à partir de code json
function genererGallerie(projets){
    gallerie.innerHTML = ``
    for(let i = 0; i < projets.length; i++){
        const projet = projets[i]
        const figure = document.createElement("figure")
        const projetImage = document.createElement("img")
        projetImage.src = projet.imageUrl
        const projetTitre = document.createElement("figcaption")
        projetTitre.innerText = projet.title
        figure.appendChild(projetImage)
        figure.appendChild(projetTitre)
        gallerie.appendChild(figure)
    }
}
genererGallerie(projets)

// écouter les boutons pour afficher la gallerie différemment au click
const boutonTous = document.querySelector(`input[name="Tous"]`)
boutonTous.addEventListener("click", function (){
    genererGallerie(projets)
})


const boutonObjets = document.querySelector(`input[name="Objets"]`)
boutonObjets.addEventListener("click", function (){
    const objets = projets.filter(function(projets){
        return projets.category.name === "Objets"
    })
    genererGallerie(objets)
})

const boutonAppartements = document.querySelector(`input[name="Appartements"]`)
boutonAppartements.addEventListener("click", function (){
    const appartements = projets.filter(function(projets){
        return projets.category.name === "Appartements"
    })
    genererGallerie(appartements)
})

const boutonHotelEtRestaurants = document.querySelector(`input[name="Hotels & restaurants"]`)
boutonHotelEtRestaurants.addEventListener("click", function(){
    const HotelEtRestaurants = projets.filter(function(projets){
        return projets.category.name === "Hotels & restaurants"
    })
    genererGallerie(HotelEtRestaurants)
})
