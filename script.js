document.addEventListener("DOMContentLoaded", function() {
    const todoList = document.getElementById("todo-list");
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const undoneCountElement = document.getElementById("undoneCount");
    const doneCountElement = document.getElementById("doneCount");

    let tasks = [];
    // to load the tasks from the local storage
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }

    addTaskButton.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const currentTime = getCurrentTime();
            const task = {
                text: taskText,
                time: currentTime,
                completed: false,
            };
            tasks.push(task);
            saveTasksToLocalStorage();
            renderSingleTask(task);
            taskInput.value = "";
            if (!task.completed) {
                undoneCount++; 
                updateTaskCount();
            }
        }
    });

    function getCurrentTime() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        return currentTime;
    }

    function createTaskElement(task) {
        const taskElement = document.createElement("div");
        taskElement.className = "todo-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasksToLocalStorage();
            if (task.completed) {
                doneCount++; 
                undoneCount--; 
            } else {
                doneCount--;
                undoneCount++; 
            }
            updateTaskCount();
        });
        const taskTextElement = document.createElement("span");
        taskTextElement.textContent = task.text;
        const timeTextElement = document.createElement("span");
        timeTextElement.textContent = task.time;
        const crossElement = document.createElement("span");
        crossElement.textContent = "✖";
        crossElement.className = "cross";
        crossElement.addEventListener("click", function() {
            const index = tasks.indexOf(task);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
                todoList.removeChild(taskElement);
                if (task.completed) {
                    doneCount--; 
                } else {
                    undoneCount--;
                }
                updateTaskCount();
            }
        });
        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskTextElement);
        taskElement.appendChild(timeTextElement);
        taskElement.appendChild(crossElement);
        return taskElement;
    }

    function renderTasks() {
        todoList.innerHTML = "";
        undoneCount = 0;
        doneCount = 0;
        tasks.forEach(function(task) {
            renderSingleTask(task);
            if (task.completed) {
                doneCount++;
            } else {
                undoneCount++;
            }
        });
        updateTaskCount();
    }

    function renderSingleTask(task) {
        const taskElement = createTaskElement(task);
        todoList.appendChild(taskElement);
    }

    function updateTaskCount() {
        undoneCountElement.textContent = undoneCount;
        doneCountElement.textContent = doneCount;
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});