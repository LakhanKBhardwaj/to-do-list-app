

// Edit the task name 
function handleEdit(taskId) {
    const taskName = document.getElementById(`task-name-${taskId}`);
    const taskInput = document.getElementById(`task-input-${taskId}`);
    const saveButton = document.getElementById(`save-task-${taskId}`);
    const editButton = document.getElementById(`edit-task-${taskId}`);

    console.log("task id : ", taskId)
    // Hide the task name and edit button
    taskName.style.display = 'none';
    editButton.style.display = 'none';

    // Show the input box and save button
    taskInput.style.display = 'inline-block';
    saveButton.style.display = 'inline-block'


}

//save the edit task name 
function handleSave(taskId) {
    const taskName = document.getElementById(`task-name-${taskId}`);
    const taskInput = document.getElementById(`task-input-${taskId}`);
    const saveButton = document.getElementById(`save-task-${taskId}`);
    const editButton = document.getElementById(`edit-task-${taskId}`);

    // Update the task name with the input value
    const updatedTaskText = taskInput.value;

    console.log("task id : ", taskId)
    fetch(`/editTask/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: updatedTaskText }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                taskName.textContent = updatedTaskText;
                taskName.style.display = "inline-block";
                editButton.style.display = "inline-block";
                taskInput.style.display = "none";
                saveButton.style.display = "none";
            } else {
                alert(data.message || "Failed to update the task.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while saving the task.");
        });

}


//Remove the task 
function handelDelete(taskId) {

    console.log("tasl Id : ", taskId)
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this task?")) {
        fetch(`/deleteTask/${taskId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete the task.");
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    //Remove the task from DOM after successful deletion
                    const task = document.getElementById(`task-item-${taskId}`);
                    if (task) {
                        task.remove();
                    }
                } else {
                    alert('Failed to delete the task.');
                }
            })
            .catch((error) => {
                console.log('Error : ', error);
                alert("An error occurred while deleting the task.")
            })
    }
}

