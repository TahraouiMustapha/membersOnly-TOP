const { Router } = require("express")
const usersRouter = Router() ;
const usersController = require("../controllers/usersController");
const passport = require("passport");


usersRouter.get("/", (req, res)=> {
    res.render("main", { 
        title: "Members Only",
        user: req.user 
    })
})
usersRouter.get("/sign-up", (req, res)=> res.render("sign-up"))
usersRouter.get("/login", (req, res)=> res.render("login", {
    title: "Members only"
}))

usersRouter.get("/new-message", (req, res)=> res.render("newMessage", {
    title: "New Message",
    user: req.user
}))

usersRouter.post("/sign-up", usersController.registerUser )
usersRouter.post(
    "/login", 
    passport.authenticate("local", {
        successRedirect: "/", 
        failureRedirect: "/login"   
    })
)

usersRouter.post("/new-message", usersController.createMsg )

module.exports = usersRouter;