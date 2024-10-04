let tasks =[];

document.addEventListener('DOMContentLoaded', ()=> {
    const storedTasks=JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=>tasks.push(task));
        updateTaskList();
        updateStatus();
    }
})
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value.trim();

  const editIndex = taskInput.dataset.editIndex; 

  if (text) {
      if (editIndex) {
          tasks[editIndex].text = text; 
          showToast('Task updated successfully!'); 
          delete taskInput.dataset.editIndex; 
      } else {
          tasks.push({ text: text, completed: false });
          showToast('Task added successfully!');
      }

      taskInput.value = ''; 
      const btn = document.getElementById("newTask");
      btn.classList.remove('edit'); 
      btn.innerText = '+'; 

      updateTaskList();
      updateStatus();
      saveTasks();
  }
};




const toggleTaskComplete = (index) =>{
    tasks[index].completed =!tasks[index].completed;
    updateTaskList();
    updateStatus();
    saveTasks();

    const message = tasks[index].completed ? 'Task marked as complete!' : 'Task marked as incomplete!';
    showToast(message);


}

const deleteTask = (index)=>{
    tasks.splice(index, 1);
    updateTaskList();
    updateStatus();
    saveTasks();
    showToast('Task deleted successfully!');


}
const editTask = (index) => {
  const taskInput = document.getElementById('taskInput');
  taskInput.value = tasks[index].text; 

  taskInput.dataset.editIndex = index; 

  const btn = document.getElementById("newTask");
  btn.innerText = 'Edit'; 
};


 
const updateStatus = () =>{
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress =( completedTasks/totalTasks )*100
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText=`${completedTasks}/${totalTasks}`;

    if(tasks.length && completedTasks === totalTasks){
    
        blaskedCofetti();
    
    }
};

//  Update the status bar with the completed tasks
const updateTaskList = ()=>{
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task,index )=> {
        const listItem = document.createElement('li');
        listItem.innerHTML = `

          <div class="taskItem">
            <div class="task ${task.completed? 'completed' : ''}">

             <div class='d-flex justify-content-center align-items-center'>
            <input type="checkbox" class="checkbox" ${task.completed ?'checked' : ''} />

            <p>${task.text}</p>
            
             </div>
                <div class="icons">
                <i class="fa-solid fa-pen-to-square text-success" onClick = 'editTask(${index})'></i>
                <i class="fa-regular fa-trash-can text-danger"  onClick = 'deleteTask(${index})'></i>
                    
                </div>
            </div>
        </div>
        
            
        
        `;
        listItem.addEventListener('change',()=> toggleTaskComplete(index))
        taskList.append(listItem);
    });
}

// form submission event listener
document.getElementById("newTask").addEventListener('click', function(e) {
    e.preventDefault();
    

    addTask();
})


// toast notifications

const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
};


// celebration animations when tasks finish  
const blaskedCofetti = ()=> {
    const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };
  
  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}