 //login
 
 function Login(){

    if(firebase.auth().correntUser){
        firebase.auth().signOut()
    } 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(()=>{
            swal.fire({
                icon: "success",
                title: "Login realizado com sucesso"
            }).then(()=>{
                setTimeout(()=>{
                    window.location.replace("index.html")
                },1000)
            })
        })
        .catch((error)=>{
            const errorCode = error.code
                switch(errorCode){
                    case "auth/wrong-password":
                        swal.fire({
                            icon:"error",
                            title: "Senha Inválida."
                        })
                        break;
                    case "auth/invalid-email":
                        swal.fire({
                            icon:"error",
                            title: "Email inválido."
                        })
                        break;
                    case "auth/user-not-found":
                        swal.fire({
                            icon:"warning",
                            title: "Usuário não encontrado.",
                            text: "Deseja criar esse usuário ?",
                            shadowCancelButton: true,
                            cancelButtonText: "Não",
                            cancelButtonColor:"d33",
                            confirmButtonText:"sim",
                            confirmButtonColor:"#3085d6"
                        }).then((result)=> {
                            //autenticação para criar um novo usuário
                            signUp(email,password)
                        })
                        break;
                    default:
                        swal.fire({
                            icon:"error",
                            title: error.message
                        })
                }
        })
}

//REGISTRO
//autenticação para criar um novo usuário e condições para senha
function signUp(email,password){
    firebase
    .auth()
    .createUserWithEmailAndPassword(email,password)
    .then( ()=> {
        swal.fire({
            icon: "sucess",
            title: "Usuário criado com sucesso"
        }).then( ()=>{
            setTimeout(()=>{
                window.location.replace("index.html")
            },1000)
        })
    }).catch((error)=>{
        const errorCode = error.code;
        switch(errorCode){
            case "auth/weak-password":
                swal.fire({
                    icon: "error",
                    title: "Senha muito fraca"
                })
                break;
                default:
                    swal.fire({
                        icon: "error",
                        title: error.message
                    })
        }
    })
}

function logout(){
    //acessa uma função específica do firebase : firebase.auth.signOut()
    firebase.auth().signOut()
}