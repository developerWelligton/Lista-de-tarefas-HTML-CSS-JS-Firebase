//conexao com banco
const db = firebase.firestore()
let tasks = []
let currentUser = {} 

//pegar a informação do usuário autenticado
function getUser(){
    firebase.auth().onAuthStateChanged((user)=>{//escutador
        //está autenticado ?
        if(user){
            //pega o id do usuário autenticado
            currentUser.uid = user.uid
            //leitura somente quando o usuário estiver autenticado
            readTasks()
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

//criação do botão
function createDelButton(task){
    const newButton = document.createElement('button')
    newButton.setAttribute('class','btn-primary')
    newButton.appendChild(document.createTextNode("Excluir"))
    newButton.setAttribute("onclick",`deleteTask("${task.id}")`)
    return newButton 

}


/* <ul id="itemList" class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                      Atividade 1
                        <button class="btn btn-primary  ">Excluir</button>
                    </li>

                    <li class="list-group-item d-flex justify-content-between">
                      Atividade 2
                        <button class="btn btn-primary">Excluir</button>
                    </li>
                </ul>

                •itemList
                */

//criar os elementos com base na estrutura estática
function renderTasks(){
let itemList = document.getElementById("itemList")
    itemList.innerHTML = ""

    for(let task of tasks){
         const newItem = document.createElement('li')
         newItem.setAttribute('class','list-group-item d-flex justify-content-between'
         )
         newItem.appendChild(document.createTextNode(task.title))
         newItem.appendChild(createDelButton(task))
         itemList.appendChild(newItem)
    }
}




//ler o dados da firebase 
async function readTasks(){
    tasks = [] 
    //fazer leitura filtrando o usuário
    const logTasks = await db
    .collection("tasks")
    .where("owner","==",currentUser.uid)
    .get()
    //fazer alteração nas regras de permisões na firebase
    for(doc of logTasks.docs){
        tasks.push({
            id:doc.id,
            title:doc.data().title,
        })
    }
    renderTasks() 

}
//Adicionar tarefas em conexão ao firebase
async function addTasks(){
    const title = document.getElementById("newItem").value
    if(title != ''){
      await db.collection('tasks').add({
        title:title,
        //filtrar tarefa pro usuário
        //owner serve para saber qual usuário ta gravando essa tarefa
        //assim é preciso criar um objeto global
        owner: currentUser.uid,
    })  
     //renderizar!
    readTasks()
    }else{
        alert("Campo vazio")
    }
   
    //apagar o campo
   title.value='';
  }

//deletar tarefa + associar com botão excluir
async function deleteTask(id){
    await db.collection('tasks').doc(id).delete()
    readTasks()

}

//carregamento da page
window.onload = function(){
    getUser()
    //readTasks(); leitura global
}