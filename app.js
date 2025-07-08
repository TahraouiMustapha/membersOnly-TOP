const express = require("express")
const path = require("path")
const app = express();

require("dotenv").config();

const userController = require("./controllers/usersController");
const usersRouter = require("./routes/usersRoute");

// app configuration
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use("/", usersRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`my port is listening on ${PORT}`)
})