const { Router } = require("express")
const usersRouter = Router() ;
const usersController = require("../controllers/usersController");
const passport = require("passport");

// attach user for all views 
usersRouter.use((req, res, next) => {
    res.locals.user = req.user || null;
    next()
})

usersRouter.get("/", (req, res)=> {
    res.render("main", { 
        title: "Members Only"
    })
})
usersRouter.get("/sign-up", (req, res)=> res.render("sign-up"))
usersRouter.get("/login", (req, res)=> res.render("login", {
    title: "Members only"
}))

usersRouter.get("/new-message", (req, res)=> res.render("newMessage", {
    title: "New Message"
}))

// join the club
usersRouter.get("/join-the-club", (req,res)=> res.render("join-the-club", {
    title: "Join The Club"
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
usersRouter.post("/join-the-club", usersController.joinTheClub )

module.exports = usersRouter;