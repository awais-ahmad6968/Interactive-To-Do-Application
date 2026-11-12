const input = document.querySelector("input")
const form = document.querySelector("form")
const list = document.querySelector("#tasks")
const error = document.querySelector("#err-msg")
const emptyMsg = document.querySelector("#emptyMsg")
const storageList = JSON.parse(localStorage.getItem("tasks")) || []
const progress = document.querySelector("#progress")
const numbers = document.querySelector("#numbers")

fetchTasks()

form.addEventListener("submit", function(e){

    e.preventDefault()

// Form Validation

    if(input.value.trim()===""){
        showError("Please Enter a Task")
        return
    }

    removeError()

    // Saving Data

    let taskText = input.value;
    let completed = false;
    storageList.push({taskText, completed})

    saveToLocalStorage()
    fetchTasks()

    this.reset()

})

function showError(msg){
    error.textContent = `* ${msg}`;
    input.style.border = "2px solid #ff3860"
}
function removeError(){
    error.textContent = ""
    input.style.border = "2px solid #09c372"

}
function saveToLocalStorage(task){
   localStorage.setItem("tasks", JSON.stringify(storageList))
}
function updateProgress(){
    let totalTasks = storageList.length
    let completedTasks = list.querySelectorAll("input:checked").length
    progress.style.width = totalTasks ? `${((completedTasks/totalTasks)*100)}%` : `0%`
    numbers.textContent = `${completedTasks}/${totalTasks}`
}

function toggleEmptyState(){
    emptyMsg.style.display = storageList.length === 0 ? `block` : `none`
}

function fetchTasks(){

    list.innerHTML = ""

    storageList.forEach((item, i)=>{

           // Creating Task Item

    const task = document.createElement("li")
    task.className = "mb-2 w-full p-2 border-2 border-[#E7E9EF] rounded-full flex justify-between items-center"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "size-5 checked:bg-[#6C5CE7] appearance-none rounded-full border-2 border-[#C8CBD4] checked:border-[#6C5CE7] checked:scale-[1.1] bg-transparent checked:before:content-['✓'] checked:before:text-white checked:before:text-[12px] checked:before:font-bold checked:before:flex checked:before:items-center checked:before:justify-center"
    checkbox.checked = item.completed

    const span = document.createElement("span")
    span.textContent = item.taskText
    span.className = "grow ml-3"

    const del = document.createElement("button")
    del.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'
    del.className = " size-8 bg-[#D64545] hover:scale-[1.1] rounded-full text-white cursor-pointer text-[16px] flex justify-center items-center"

    del.addEventListener("click", function(e){
        storageList.splice(i,1)
        saveToLocalStorage()
        fetchTasks()
    })

    const edit = document.createElement("button")
    edit.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>'
    edit.className = " mr-2 size-8 bg-amber-600 hover:scale-[1.1] rounded-full text-white cursor-pointer text-[16px] flex justify-center items-center"
    
    edit.addEventListener("click", function(e){
        input.value = span.textContent;
        storageList.splice(i, 1)
        saveToLocalStorage()
        fetchTasks()
    })
    checkbox.addEventListener("change", function(e){
        item.completed = checkbox.checked
        saveToLocalStorage()
        fetchTasks()

    })

    if(item.completed){
        span.classList.add("line-through","text-[#555]")
        edit.disabled = true
        edit.style.opacity = "0.7"
        edit.style.pointerEvents = "none"
    }

        task.append(checkbox,span,edit,del)
        list.append(task)
    }) 
    toggleEmptyState()
    updateProgress()
   
}