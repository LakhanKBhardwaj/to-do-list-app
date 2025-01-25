import { createTaskList } from './createElements.js';

document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("add-task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const editTask = document.querySelectorAll(".edit-button");
    const updateTask = document.querySelectorAll(".save-button");

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

        // Append the popup to the body
        document.body.appendChild(popup);

        // Remove the popup after 3 seconds
        setTimeout(() => {
            popup.remove();

        }, 10000);
    }

    // Handle form submission
    todoForm.addEventListener("submit", async (event) => {
        event.preventDefault();// Prevent the default form submission

        const taskName = taskInput.value.trim();

        if (taskName) {
            // Prepare the data to send to the server
            const newTask = {
                taskName: taskName,
                date: new Date()
            };

            try {
                const response = await fetch("http://localhost:8000/api/create-task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTask)
                });

                if (response.ok) {
                    const newTask = await response.json();

                    // Update the UI dynamically
                    const listItem = createTaskList(newTask);
                    taskList.appendChild(listItem)
                    // Show success message
                    showPopupMessage("Task added successfully!", true);

                    taskInput.value = ""; // Clear the input field
                } else {
                    // Handle error responses from the server
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                console.error("Error adding task:", error);
                showPopupMessage("There was an issue adding the task.", false);
            }
        } else {
            showPopupMessage("Please enter a task!", false);
        }
    });



    // Helper function to get task elements with task id
    function getTaskElements(taskId) {
        return {
            taskName: document.getElementById(`task-name-${taskId}`),
            taskInput: document.getElementById(`task-input-${taskId}`),
            saveButton: document.getElementById(`save-task-${taskId}`),
            editButton: document.getElementById(`edit-task-${taskId}`)
        };
    }


    // Edit the task name 
    editTask.forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.target.dataset.taskId;
            console.log("edit task id : ", taskId)
            const { taskName, taskInput, saveButton, editButton } = getTaskElements(taskId);


            // Hide the task name and edit button
            taskName.style.display = 'none';
            editButton.style.display = 'none';

            // Show the input box and save button
            taskInput.style.display = 'inline-block';
            saveButton.style.display = 'inline-block'
        });
    });



    //save the edit task name 
    updateTask.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const taskId = event.target.dataset.taskId;
            console.log("save task id : ", taskId)
            const { taskName, taskInput, saveButton, editButton } = getTaskElements(taskId);

            //update the task name with the input value
            const editTaskName = taskInput.value;

            if (editTaskName) {
                // Prepare the data to send to the server
                const updatedTask = {
                    taskId: taskId, // Include the taskId
                    taskName: editTaskName,
                    date: new Date()
                };

                try {
                    const response = await fetch("http://localhost:8000/api/update-task", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedTask)
                    });

                    if (response.ok) {
                        const result = await response.json();

                        taskName.textContent = result.taskName; // Update the name in the UI
                        taskName.style.display = "inline-block";
                        editButton.style.display = "inline-block";
    
                        taskInput.style.display = "none";
                        saveButton.style.display = "none";
    
                        // Show success message
                        showPopupMessage("Task update successfully!", true);
                    } else {
                        // Handle error responses from the server
                        const error = await response.json();
                        showPopupMessage(`Error: ${error.message}`, false);
                    }
                } catch (error) {
                    console.error("Error update task:", error);
                    showPopupMessage("There was an issue update the task.", false);
                }
            } else {
                showPopupMessage("Please enter a task!", false);
            }
        });
    });



});




// //save the edit task name 
// function handleSave(taskId) {
//     const taskName = document.getElementById(`task-name-${taskId}`);
//     const taskInput = document.getElementById(`task-input-${taskId}`);
//     const saveButton = document.getElementById(`save-task-${taskId}`);
//     const editButton = document.getElementById(`edit-task-${taskId}`);

//     // Update the task name with the input value
//     const updatedTaskText = taskInput.value;

//     console.log("task id : ", taskId)
//     fetch(`/editTask/${taskId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: updatedTaskText }),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then((data) => {
//             if (data.success) {
//                 taskName.textContent = updatedTaskText;
//                 taskName.style.display = "inline-block";
//                 editButton.style.display = "inline-block";
//                 taskInput.style.display = "none";
//                 saveButton.style.display = "none";
//             } else {
//                 alert(data.message || "Failed to update the task.");
//             }
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//             alert("An error occurred while saving the task.");
//         });

// }


// //Remove the task 
// function handelDelete(taskId) {

//     console.log("tasl Id : ", taskId)
//     // Confirm before deleting
//     if (confirm("Are you sure you want to delete this task?")) {
//         fetch(`/deleteTask/${taskId}`, {
//             method: "DELETE",
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Failed to delete the task.");
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 if (data.success) {
//                     //Remove the task from DOM after successful deletion
//                     const task = document.getElementById(`task-item-${taskId}`);
//                     if (task) {
//                         task.remove();
//                     }
//                 } else {
//                     alert('Failed to delete the task.');
//                 }
//             })
//             .catch((error) => {
//                 console.log('Error : ', error);
//                 alert("An error occurred while deleting the task.")
//             })
//     }
// }

// setTimeout(function() {
//     const alerts = document.querySelectorAll('.alert-box');
//     alerts.forEach(alert => {
//       alert.style.display = 'none';
//     });
//   }, 5000); // 5000ms = 5 seconds