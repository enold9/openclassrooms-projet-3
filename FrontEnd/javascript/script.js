const reponse = await fetch("http://localhost:5678/api/works")
let projets = await reponse.json()


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

// fonction pour afficher la gallerie dans le popup
function afficherMiniGallerie(){
    const miniGallerie = document.querySelector(".miniGallery")
    miniGallerie.innerHTML = ``
    for(let i = 0; i < projets.length; i++){
        const projet = projets[i]
        const miniCase = document.createElement("div")
        miniCase.classList.add("miniCase")
        miniCase.innerHTML = `<span class="fa-solid fa-trash-can fa-xs delete"></span>`   

        const miniImage = document.createElement("img")
        miniImage.src = projet.imageUrl

        miniCase.appendChild(miniImage)
        miniGallerie.appendChild(miniCase)
    }
}

// fonction pour refresh les images après une reponse positive du serveur
async function refreshImages(reponse){
    console.log("abracadabra")
    if(reponse.status < 400){
        console.log("yabadabadoo")
        const reponseWorks = await fetch("http://localhost:5678/api/works")
        projets = await reponseWorks.json()
        genererGallerie(projets)
        afficherMiniGallerie()
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
}

function cacherPopups(){
    const popupBackground = document.querySelector(".popupBackground")
    popupBackground.classList.add("hidden")
    const popup = document.querySelectorAll(".popup")
    for(let i = 0; i < popup.length; i++){
        popup[i].classList.add("hidden")
    }
}

let logged = window.localStorage.getItem("logged")
logged = JSON.parse(logged)

function logout(){
    window.localStorage.removeItem("logged")
}


if(logged === null){
    // écoute les boutons pour afficher la gallerie différemment au click
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
}

else {
    // faire le logout

    // cache les boutons filtres
    const boutons = document.querySelector(".filtres")
    boutons.classList.add("hidden")

    // affiche le popup si on clique sur modifier
    const modifier = document.querySelector("#portfolio bouton")
    modifier.classList.remove("hidden")
    modifier.addEventListener("click", async () =>{
        afficherPopups()
        afficherMiniGallerie()

        // efface la photo 
        const poubelle = document.querySelectorAll(".delete")
        for(let i = 0; i < poubelle.length; i++){
            poubelle[i].addEventListener("click", async () =>{
                const reponseDelete = await fetch(`http://localhost:5678/api/works/${i}`, {
                    method: "DELETE",
                    headers: {"Authorization": `Bearer ${logged.token}`}
                }) 
                    refreshImages(reponseDelete)
            })
        }
    })

    // affiche le popup suivant si le bouton ajouter une photo est cliqué
    const popupAjoutPhoto = document.querySelector(".firstPopup button")
    const ajoutPhoto = document.querySelector(".firstPopup")
    popupAjoutPhoto.addEventListener("click", async () => {
        ajoutPhoto.classList.add("hidden")

        // efface l'image si il y en a une
        const champImage = document.getElementById("photo")
        champImage.value = ""
        const elements = document.querySelectorAll(".photoArea img, .photoArea span, .photoArea h3, .photoArea p")
        const image = elements[0]
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
        const reponse = await fetch("http://localhost:5678/api/categories")
        const categorie = await reponse.json()
        for(let i=0 ; i<categorie.length ; i++){
            const option = document.createElement("option")
            option.value = categorie[i].id
            option.innerText = categorie[i].name
            selection.appendChild(option)
        }

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

        // active le bouton valider si tous les champs sont remplis
        const boutonValider = document.querySelector(".valider button")
        const champs = document.querySelectorAll(".popup input, .popup select")
        for(let i = 0; i<champs.length; i++){
            champs[i].addEventListener("change", () => {
                if(champs[0].value != "" & champs[1].value != "" & champs[2].value != ""){
                    boutonValider.removeAttribute("disabled")
                }else{
                    boutonValider.setAttribute("disabled", "")
                }
            })
        }

        // ajoute l'image dans l'api
        const ajouterImage = document.querySelector(".popup form")
        console.log(ajouterImage)
        ajouterImage.addEventListener("submit", async (event) => {
            event.preventDefault()
            console.log(event)
            console.log(event.target[0].value)
            console.log(event.target[1].value)
            console.log(event.target[2].value)
            console.log(logged.token)
            const body = {
                "image" : event.target[0].value,
                "title" : event.target[1].value,
                "category" :1 // event.target[2].value
                // "imageUrl" : event.target[0].value,
                // "title" : event.target[1].value,
                // "categoryId" : event.target[2].value
            }
            console.log(body)
            const reponsePost = await fetch (`http://localhost:5678/api/works`,{
                method: "POST",
                //application/json
                mode: "no-cors",
                headers: {"content-Type" : "multipart/form-data",
                          "Authorization": `Bearer ${logged.token}`
                },
                body: JSON.stringify(body),
            })
            refreshImages(reponsePost)
            cacherPopups()
        })
    })

    // enleve le popup si on clique sur la crois ou en dehors et revient en arrière avec la flèche
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
}