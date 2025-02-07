import { createTaskList } from './createElements.js';

// Function to show popup message
function showPopupMessage(message, isSuccess = true) {
  const popup = document.createElement('div');
  popup.classList.add('popup-message');
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.padding = '10px 20px';
  popup.style.backgroundColor = isSuccess ? 'green' : 'red';
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.fontSize = '16px';
  popup.style.zIndex = '1000';
  popup.innerText = message;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000); // Shortened popup duration
}

async function handleSubmit(event) {
    console.log('Click on submit button');
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    console.log('Input form value:', taskInput.value);

    const taskName = taskInput.value.trim();

    if (taskName) {
        const newTask = {
        taskName: taskName,
        date: new Date(),
        };

        try {
        const response = await fetch("http://localhost:8000/api/create-task", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            const createdTask = await response.json();
            const taskList = document.getElementById('task-list'); // Ensure this element exists
            const listItem = createTaskList(createdTask);
            taskList.appendChild(listItem);

            showPopupMessage("Task added successfully!", true);

            // Clear the input field
            taskInput.value = '';
        } else {
            const error = await response.json();
            showPopupMessage(`Error: ${error.message}`);
        }
        } catch (error) {
            console.error("Error adding task:", error);
            showPopupMessage("There was an issue adding the task.", false);
        }
    } else {
        showPopupMessage("Please enter a task!", false);
    }
}



// Handle Edit function
async function handleEdit (taskId) {
    console.log('click on the edit button task Id =', taskId);
    const taskName = document.getElementById(`task-name-${taskId}`);
    const taskInput = document.getElementById(`task-input-${taskId}`);
    const saveButton = document.getElementById(`save-task-${taskId}`);
    const editButton = document.getElementById(`edit-task-${taskId}`);

    taskName.style.display = "none";
    editButton.style.display = "none";
    taskInput.style.display = "inline-block";
    saveButton.style.display = "inline-block";
}


// Handle update function
async function handleSave(taskId) {
    console.log('click on the save button task Id =', taskId);
    const taskName = document.getElementById(`task-name-${taskId}`);
    const taskInput = document.getElementById(`task-input-${taskId}`);
    const saveButton = document.getElementById(`save-task-${taskId}`);
    const editButton = document.getElementById(`edit-task-${taskId}`);

    const updatedTaskName = taskInput.value.trim();

    if (updatedTaskName) {
        const updatedTask = {
            taskId: taskId, // Include taskId
            taskName: updatedTaskName, // Include taskName
            date: new Date().toISOString() // Include the date as ISO string
        };

        try {
            const response = await fetch(`http://localhost:8000/api/update-task`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask) // Send full task object
            });

            if (response.ok) {
                const updatedTaskData = await response.json();
                taskName.textContent = updatedTaskData.taskName;  // Corrected to display taskName
                taskName.style.display = "inline-block";
                editButton.style.display = "inline-block";
                taskInput.style.display = "none";
                saveButton.style.display = "none";
            } else {
                const errorData = await response.json();
                console.error("Server error:", errorData.message);
                showPopupMessage(errorData.message, false);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            showPopupMessage("There was an issue updating the task.", false);
        }
    } else {
        showPopupMessage("Please enter a task!", false);
    }
}


// Handle Delete function
async function handleDelete(taskId) {
    console.log('click on the delete button task Id =', taskId);
    try {
        const response = await fetch('http://localhost:8000/api/delete-task', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskId })
        });

        if (response.ok) {
            const deletedTask = await response.json();
            const taskList = document.getElementById('task-list');
            const taskElement = document.getElementById(`task-item-${taskId}`);

            if (taskElement) {
                // taskList.removeChild(taskElement); // Remove the task row from the list
                taskElement.remove(); // Directly remove the task element from the DOM
            }else {
                console.warn(`Task element with ID task-item-${taskId} not found.`);
            }

            showPopupMessage("Task deleted successfully!", true);
        } else {
            const errorData = await response.json();
            console.error("Error deleting task:", errorData.message);
            showPopupMessage(errorData.message, false);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        showPopupMessage("There was an issue deleting the task.", false);
    }
}

// Attach the function to the window object
window.handleSubmit = handleSubmit;
window.handleEdit = handleEdit;
window.handleSave = handleSave;
window.handleDelete = handleDelete;