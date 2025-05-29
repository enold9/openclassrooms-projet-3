const boutonLogin = document.querySelector(".login form")
boutonLogin.addEventListener("submit", async (event) => {
    event.preventDefault()
    const messageErreur = document.querySelector(".login p")
    const mail = document.getElementById("email")
    const mdp = document.getElementById("mdp")
    messageErreur.classList.add("hidden")
    mail.classList.remove("error")
    mdp.classList.remove("error")
    const body = {
        "email": mail.value,
        "password": mdp.value
    }
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"content-Type" : "application/json"},
        body: JSON.stringify(body),
    })

    if(JSON.stringify(reponse.status)==="200"){
        const logged = await reponse.json()
        const valeurLogged = JSON.stringify(logged)
        window.localStorage.setItem("logged",valeurLogged)
        window.location.replace("http://127.0.0.1:5500/FrontEnd/index.html")
    }else{
        mail.value = ``
        mail.classList.add("error")
        mdp.value = ``
        mdp.classList.add("error")
        messageErreur.classList.remove("hidden")
    }
})