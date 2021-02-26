//conexao com banco
const db = firebase.firestore()
let tasks = [] 

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
    const logTasks = await db.collection("tasks").get()
    
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
        title:title
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
    readTasks().orderBy();
}