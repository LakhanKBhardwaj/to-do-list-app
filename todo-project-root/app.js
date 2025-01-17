const express = require("express");
const Todo = require("./models/todoModels");
// const path = require("path");

const app = express();

app.use("/static", express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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

// Post todo list
app.post("/", async(req, res, next) => {
    try {
        console.log(req.body);
        await Todo.create(req.body);
        res.redirect("/");
    } catch (error) {
        console.log(error.name, error.message)
        res.redirect("/")
    }
});

module.exports = app;