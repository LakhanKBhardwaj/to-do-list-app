const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the next sequence value for taskId
async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { value: 1 } }, // Increment the value by 1
        { new: true, upsert: true } // Create the counter if it doesn't exist
    );
    return counter.value;
}

module.exports = { Counter, getNextSequence };