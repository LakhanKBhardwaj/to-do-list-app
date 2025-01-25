export function createTaskList(newTask) {
    // Create a new <li> element for the task
    const listItem = document.createElement("li");
    listItem.className = "todo-list-item";
    listItem.id = `task-item-${newTask.taskId}`;

    // Create and add the task name span
    const taskNameSpan = document.createElement("span");
    taskNameSpan.className = "todo-list-item-name";
    taskNameSpan.id = `task-name-${newTask.taskId}`;
    taskNameSpan.innerText = `${newTask.taskName}`;

    // Append the task name span to the list item
    listItem.appendChild(taskNameSpan);

    // Add Edit, Save, and Remove buttons (you may need to adjust button IDs)
    listItem.innerHTML += `
         <button type="button" id="edit-task-${newTask.taskId}" onclick="handleEdit('${newTask.taskId}')" class="edit-button">
             <i class="fas fa-edit"></i>
             <span>Edit</span>
         </button>
         <form action="/" method="POST" class="form" style="display: inline;">
             <input type="text" id="task-input-${newTask.taskId}" value="${newTask.taskName}" class="task-list-input" name="task" required style="display:none">
             <button type="button" id="save-task-${newTask.taskId}" onclick="handleSave('${newTask.taskId}')" class="save-button" style="display:none">
                 <i class="fas fa-save"></i>
                 <span>Save</span>
             </button>
         </form>
         <button type="button" id="delete-task-${newTask.taskId}" onclick="handleDelete('${newTask.taskId}')" class="remove-button">
             <i class="fas fa-times"></i>
             <span>Remove lakhan</span>
         </button>
     `;

    return listItem; // Return the created <li> element
}