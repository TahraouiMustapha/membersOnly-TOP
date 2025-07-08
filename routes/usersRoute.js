const { Router } = require("express")
const usersRouter = Router() ;
const usersController = require("../controllers/usersController")


usersRouter.get("/", (req, res)=> res.send("main page"))
usersRouter.get("/sign-up", (req, res)=> res.render("sign-up"))

usersRouter.post("/sign-up", usersController.registerUser )

module.exports = usersRouter;