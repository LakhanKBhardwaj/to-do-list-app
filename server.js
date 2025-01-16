const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose 
    .connect(DB)
    .then(() => {
        console.log("database connection successfull")
    })
    .catch((error) => console.log(error.name, error.message));

app.listen(8000, () => console.log("listenig on port 8000"));