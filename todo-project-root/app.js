const express = require("express");
const Todo = require("./models/todoModel");
const { getNextSequence } = require("./models/counterModel"); // Import the counter model

const app = express();

app.use("/static", express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());  // This allows you to access req.body as an object

const cors = require('cors');
app.use(cors());  // Allow cross-origin requests

// Get todo list
app.get("/", async (req, res) => {
    try {
        const tasks = await Todo.find();
        console.log("Fetched tasks:", tasks); // Logs the tasks to the terminals
        res.render("todo.ejs", { todoTasks: tasks }); // Renders the view
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.redirect("/");
    }
});

// Create new todo task
app.post("/", async (req, res, next) => {
    try {
        // Get the next taskId from the counter collection
        const taskId = await getNextSequence("taskId");

        // Create a new Todo
        const newTodo = new Todo({
            taskId: taskId,  // Set the taskId to the next value
            taskName: req.body.task, // Use req.body.task to get the task name
            date: new Date() // Use the current date for the task date
        });

        await newTodo.save(); // Save the new todo to MongoDB
        res.redirect("/");
    } catch (error) {
        console.log(error.name, error.message)
        res.redirect("/")
    }
});

// Edit todo task 
app.post("/editTask/:taskId", async (req, res) => {
    const taskId = req.params.taskId; // Use the taskId from the URL
    const { text } = req.body;        // Get the updated task name from the request body
    console.log("Request Body:", req.body);
    console.log(`taskId: ${taskId}, text: ${text}`);
    try {
        // Find the task using taskId and update the taskName field
        const updatedTask = await Todo.findOneAndUpdate(
            { taskId: taskId },    // Match the task by taskId (not _id)
            { taskName: text },     // Update the taskName field with the new value
            { new: true }           // Return the updated document
        );
        console.log('updated data', updatedTask)
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Respond with the updated task
        res.json({ success: true, task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Remove the task
app.delete("/deleteTask/:taskId", async (req, res) => {
    const taskId = req.params.taskId; // Use the taskId from the URL

    try {
        // Find the task by taskId and delete it
        const deletedTask = await Todo.findOneAndDelete({ taskId: taskId });

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Send success response
        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

})

module.exports = app;