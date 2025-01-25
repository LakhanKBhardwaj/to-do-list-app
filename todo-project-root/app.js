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

// POST route to add a new task to the database
app.post("/api/create-task", async (req, res) => {
    console.log("Received data:", req.body); // Log the incoming request body
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





module.exports = app;