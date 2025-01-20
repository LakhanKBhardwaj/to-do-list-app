const mongoose = require("mongoose");

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true,
        unique: true
    },
    taskName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

// Create the model for the Todo collection
const Todo = mongoose.model("Todo", todoSchema);

// Export the model to use in other parts of the application
module.exports = Todo;