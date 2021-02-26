//pegar a informação do usuário autenticado
function getUser(){
    firebase.auth().onAuthStateChanged((user)=>{//escutador
        if(user){
            let userLabel = document.getElementById("navbarDropdownUser")
            userLabel.innerHTML = user.email
        }else{
            swal
             .fire({
                 icon:"success",
                 title:"Redirecionando para tela de autenticação",
             }).then(()=>{
                 setTimeout(()=>{
                     window.location.replace('login.html')
                 },1000)
             })
        }
    })
}

window.onload = function(){
    getUser()
}