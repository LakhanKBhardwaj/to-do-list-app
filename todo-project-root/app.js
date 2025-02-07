const express = require("express");
const Todo = require("./models/todoModel");
const { getNextSequence } = require("./models/counterModel"); // Import the counter model
const cors = require('cors');

const app = express();
app.set("view engine", "ejs");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // This allows you to access req.body as an object // Middleware to parse JSON bodies
app.use(cors()); // Allow cross-origin requests 

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Get todo list
app.get("/", async (req, res) => {
    try {
        const tasks = await Todo.find();
        res.render("todo.ejs", { todoTasks: tasks }); // Renders the view
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.redirect("/");
    }
});

// POST route to add a new task to the database
app.post("/api/create-task", async (req, res) => {
    const { taskName, date } = req.body;

    if (!taskName || !date) {
        return res.status(400).json({ message: "Task name is required" })
    }

    try {
        // Get the next taskId from the counter model (if needed)
        const nextTaskId = await getNextSequence("taskId");

        const newTask = new Todo({
            taskId: nextTaskId,
            taskName,
            date: new Date(date)
        });

        await newTask.save();
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Error in POST /api/create-task:", error);
        console.error("Error adding task:", error);
        res.status(500).json({ message: "There was an error creating the task" });
    }
});


// Update the task name by the task id 
app.put('/api/update-task', async (req, res) => {
   
    const {taskId, taskName, date } = req.body;
    console.log(req.body)
    if (!taskId || !taskName || !date) {
        return res.status(400).json({ message: "Task name is required" })
    }

    try {
        // Find the task by taskId and update it.
        const updatedTask = await Todo.findOneAndUpdate(
            {taskId: taskId},
            {taskName, date: new Date(date)},
            { new: true, upsert: false }  
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(201).json(updatedTask);
    }
    catch (error) {
        console.error("Error in PUT /api/update-task:", error);
        console.error("Error adding task:", error);
        res.status(500).json({ message: "There was an error updating the task" });
    }
});


// Delete the task name by the task id 
app.delete('/api/delete-task', async(req, res) => {
    

    try {
        const { taskId } = req.body;
        console.log('delete task is = ', taskId)
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const deletedTask = await Todo.findOneAndDelete({ taskId });

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        console.error("Error in DELETE /api/delete-task:", error);
        res.status(500).json({ message: "There was an error deleting the task" });
    }
});

module.exports = app;