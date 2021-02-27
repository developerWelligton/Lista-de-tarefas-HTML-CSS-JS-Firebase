//conexao com banco
const db = firebase.firestore()

//guardar informção do usuário autenticado
let currentUser = {}
let profile = false
 

//pegar a informação do usuário autenticado
function getUser(){
    firebase.auth().onAuthStateChanged((user)=>{//escutador
        if(user){
            //gravar no objeto
            currentUser.uid = user.uid
            //buscar no banco as informações do usuário
            getUserInfo(user.uid) 
            
            
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

//  //buscar no banco com base no id do usuário autenticado na coleção profile
//  async function getUserInfo(uid){
//      //consulta nos dados da fire base
//      const logUsers = await db.collection("profile").where("uid","==",uid)
//      let userInfo = document.getElementById("userInfo")

//      //está ou nao registrado
//      if(logUsers.docs){
//          userInfo.innerHTML = "Perfil não registrado";
//      }else{
//          userInfo.innerHTML = "perfil registrado";
//      }

//  }
async function getUserInfo(uid) {
    const logUsers = await db.collection("profile").where("uid", "==", uid).get()
    let userInfo = document.getElementById("userInfo")
   if(logUsers.docs.length == 0){
       userInfo.innerHTML='<strong>Perfil não registrado</strong>';
     
   }else{
    userInfo.innerHTML='<strong>Perfil  registrado</strong>';
    profile = true;
     //pegar a informação do usuário 
      //preencher form eleementos dos usuário
      const userData = logUsers.docs[0]
      currentUser.id = userData.id
      currentUser.firstName = userData.data().firstName
      document.getElementById("inputFirstName").value = currentUser.firstName
   }
     
     
  }

  //salvar perfil
  async function saveProfile(){
      //gravar os dois campos
      const firstName = document.getElementById("inputFirstName").value
      const LastName = document.getElementById("inputLastName").value
      //criar uma variavel de controle para saber se o perfil está ou nao registrado 
      //se nao tiver registrado   
      if(!profile){
          //gravar um novo perfil na coleção
          await db.collection("profile").add({
              uid: currentUser.uid,
              firstName:firstName,
              LastName:LastName
          })
          //atualizar registro
          getUserInfo()
          onload()

          alert("perfil Criado com sucesso")

         }else{
            alert("Voce ja possui perfil.Você pode alterar o nome do perfil caso queira!")
            //possibilidade de alterar o nome
            await db.collection("profile").doc(currentUser.id).update({
                firstName:firstName 
            })
         }
  }


//carregamento da page
window.onload = function(){
    getUser() //pegar as informção do usuário
    
     }
    