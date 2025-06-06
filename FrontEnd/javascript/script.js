// REDIRECTION VERS LA SECTION CONTACT DANS LE LIEN DU LOGIN
document.addEventListener("DOMContentLoaded", () => {
  const sectionToScroll = window.location.hash.substring(1);
  if (sectionToScroll) {
    setTimeout(function () {
      const targetSection = document.getElementById(sectionToScroll);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
        });
      }
    }, 100);
  }
});

// récupère les works et les categories depuis l'api
const reponse = await fetch("http://localhost:5678/api/works")
let projets = await reponse.json()
const reponseCategories = await fetch("http://localhost:5678/api/categories")
const categories = await reponseCategories.json()

// récupère le token depuis le local storage
let logged = window.sessionStorage.getItem("logged")
logged = JSON.parse(logged)

// fonction pour se déconnecter en enlevant le token
function logout(){
    window.sessionStorage.removeItem("logged")
    logged = null
}

// fonction pour générer la gallerie photo sur la page à partir de code json
const gallerie = document.querySelector(".gallery")
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

// fonction pour afficher la gallerie dans le popup
function afficherMiniGallerie(projets){
    const miniGallerie = document.querySelector(".miniGallery")
    miniGallerie.innerHTML = ``
    for(let i = 0; i < projets.length; i++){
        const projet = projets[i]
        const miniCase = document.createElement("div")
        miniCase.classList.add("miniCase")
        miniCase.id = projet.id
        miniCase.innerHTML = `<span class="fa-solid fa-trash-can fa-xs delete"></span>`   

        const miniImage = document.createElement("img")
        miniImage.src = projet.imageUrl

        miniCase.appendChild(miniImage)
        miniGallerie.appendChild(miniCase)
    }
    const poubelle = document.querySelectorAll(".delete")
    effacer(poubelle)
}

// fonction pour effacer la photo en cliquant sur une poubelle
function effacer(poubelle){
    for(let i = 0; i < poubelle.length; i++){
        poubelle[i].addEventListener("click", async (event) =>{
            event.preventDefault()
            const reponseDelete = await fetch(`http://localhost:5678/api/works/${poubelle[i].parentElement.id}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${logged.token}`}
            }) 
            refreshImages(reponseDelete)
        })
    }
}

// fonctions pour afficher et cacher le popup
function afficherPopups(){
    const popupBackground = document.querySelector(".popupBackground")
    popupBackground.classList.remove("hidden")
    const popup = document.querySelectorAll(".popup")
    for(let i = 0; i < popup.length; i++){
        popup[i].classList.remove("hidden")
    }
    afficherMiniGallerie(projets)
}

function cacherPopups(){
    const popupBackground = document.querySelector(".popupBackground")
    popupBackground.classList.add("hidden")
    const popup = document.querySelectorAll(".popup")
    for(let i = 0; i < popup.length; i++){
        popup[i].classList.add("hidden")
    }
}

// fonction pour refresh les images après une reponse positive du serveur
async function refreshImages(reponse){
    if(reponse.status < 400){
        const reponseWorks = await fetch("http://localhost:5678/api/works")
        projets = await reponseWorks.json()
        genererGallerie(projets)
        afficherMiniGallerie(projets)
    }
}

// fonction pour qu'un bouton à la fois reste vert quand on le sélectionne
function boutonEnVert(bouton){
    const filtres = document.querySelectorAll(".filters input")
    for(let i=0; i<filtres.length; i++){
        filtres[i].classList.remove("selected")
    }
    const boutonSelectionne = document.querySelector(`.filters input[value="${bouton.value}"]`)
    boutonSelectionne.classList.add("selected")
}

// fonction qui affiche les boutons
function afficherBoutons(){
    const filtres = document.querySelector(".filters")
    for(let i=-1; i < categories.length; i++){
        const bouton = document.createElement("input")
        if(i<0){
            bouton.type = "button"
            bouton.value = "Tous"
            bouton.addEventListener("click", () =>{
                genererGallerie(projets)
                boutonEnVert(bouton)
            })
        }else{
            bouton.type = "button"
            bouton.value = categories[i].name
            bouton.addEventListener("click", () =>{
                const categorieBouton = projets.filter(function(projets){
                    return projets.category.name === categories[i].name
                })
                genererGallerie(categorieBouton)
                boutonEnVert(bouton)
            })
        }
        filtres.appendChild(bouton)
    }
}

// affiche le popup suivant si le bouton ajouter une photo est cliqué
const popupAjoutPhoto = document.querySelector(".firstPopup button")
const ajoutPhoto = document.querySelector(".firstPopup")
const champImage = document.getElementById("photo")
const elements = document.querySelectorAll(".photoArea img, .photoArea span, .photoArea h3, .photoArea p")
const image = elements[0]
const valider = document.querySelector(".valider")
popupAjoutPhoto.addEventListener("click", async () => {
    valider.innerHTML = ``
    const boutonValider = document.createElement("button")
    boutonValider.type = "submit"
    boutonValider.setAttribute("disabled","")
    boutonValider.innerText = "Valider"
    valider.appendChild(boutonValider)
    ajoutPhoto.classList.add("hidden")

    // efface l'image si il y en a une
    champImage.value = ""
    image.src = ""
    for(let i = 1; i<elements.length; i++){
            elements[i].classList.remove("hidden")
        }   

    // efface le champ titre
    const titre = document.getElementById("title")
    titre.value = ""

    // efface les options pour ne pas en ajouter à chaque fois
    const selection = document.getElementById("category")
    selection.innerHTML = ``

    // rajoute une option incochable pour ne pas avoir d'option préséléctionnée
    selection.innerHTML = `<option disabled selected value style="display: none;"></option>`

    // ajoute les options à partir de l'api
    for(let i=0 ; i<categories.length ; i++){
        const option = document.createElement("option")
        option.value = categories[i].id
        option.innerText = categories[i].name
        selection.appendChild(option)
    }

    // active le bouton valider si tous les champs sont remplis
    const champs = document.querySelectorAll(".popup input, .popup select")
    for(let i = 0; i<champs.length; i++){
        champs[i].addEventListener("change", () => {
            if(champs[0].value !== "" & champs[1].value !== "" & champs[2].value !== ""){
                boutonValider.removeAttribute("disabled")
            }else{
                boutonValider.setAttribute("disabled", "")
            }
        })
    }
})

// affiche l'image selectionnée dans le champ 
champImage.addEventListener("change", () => {
    const fichier = document.querySelector("input[type=file]").files[0]; 
    if(fichier.size < 4194305){
        for(let i = 1; i<elements.length; i++){
            elements[i].classList.add("hidden")
        }   
        const lire = new FileReader();
        lire.addEventListener("load",() => {
            image.src = lire.result
        })  
        if (fichier) {
            lire.readAsDataURL(fichier);
        }
    }else{
        alert("erreur : le fichier que vous essayez d'envoyer est trop gros (4mo max)")
    }
})

// ajoute l'image dans l'api
const ajouterImage = document.querySelector(".popup form")
ajouterImage.addEventListener("submit", async (event) => {
    event.preventDefault()
    const body = new FormData()
    body.append("image" , event.target[0].files[0])
    body.append("title" , event.target[1].value)
    body.append("category" ,event.target[2].value)
    const reponsePost = await fetch (`http://localhost:5678/api/works`,{
        method: "POST",
        headers: {"Authorization": `Bearer ${logged.token}`},
        body: body,
    })
    refreshImages(reponsePost)
    cacherPopups()
})

// enleve le popup si on clique sur la croix ou en dehors et revient en arrière avec la flèche
const exit = document.querySelectorAll("div.popupBackground, .popup i")
for(let i = 0; i < exit.length; i++){
    if(i===1){
        exit[i].addEventListener("click", () => {
            ajoutPhoto.classList.remove("hidden")
        })
    }else{
        exit[i].addEventListener("click", () => {
            cacherPopups()
        })
    }
}

// fonction principale 
const boutonConnexion = document.getElementById("logButton")
function lancer(){
    genererGallerie(projets)
    const modifier = document.querySelector("#portfolio bouton")
    const edition = document.querySelector(".edition")
    if(logged === null){
        afficherBoutons()
        edition.classList.add("hidden")
        modifier.classList.add("hidden")
        boutonConnexion.innerText = "login"
        boutonConnexion.addEventListener("click", () =>{
            window.location.replace("http://127.0.0.1:5500/FrontEnd/login.html")
        })
    }

    else {
        // faire le logout
        boutonConnexion.innerText = "logout"
        boutonConnexion.addEventListener("click", () =>{
                logout()
                lancer()
        })
        // affiche le popup si on clique sur modifier
        edition.classList.remove("hidden")
        modifier.classList.remove("hidden")
        modifier.addEventListener("click", () =>{
            afficherPopups()
        })
    }
}

lancer()