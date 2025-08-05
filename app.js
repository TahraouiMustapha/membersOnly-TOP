const express = require("express")
const path = require("path")
const app = express();

const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs")


require("dotenv").config();

const db = require("./db/queries")
const usersRouter = require("./routes/usersRoute");

// app configuration
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// serving a static files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

passport.use(
    new LocalStrategy( async(username, password, done) => {
        try {
            const user = await db.getUserByUserName(username);
            if (!user) {
                console.log("no user")
                return done(null, false, { message: "Incorrect username" });
            }

                                              //plainPassword, hashedPassword 
            const match = await bcrypt.compare(password, user.password)
            
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch(err) {
            return done(err)
        } 
    })
)

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id)

    done(null, user);

  } catch(err) {
    done(err);
  }
});


app.use("/", usersRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`my port is listening on ${PORT}`)
})