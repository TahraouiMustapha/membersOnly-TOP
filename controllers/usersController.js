const db = require("../db/queries")

const {body, validationResult} = require("express-validator");

const errsTxt = {
    empty: "can not be empty", 
    length: "must be at least 8 characteres long"
}

const signUpValidator = [
    body("fullName")   
        .trim()
        .notEmpty()
        .withMessage(`Full Name ${errsTxt.empty}`),
    body("username")
        .trim()
        .notEmpty()
        .withMessage(`Username ${errsTxt.empty}`)
        .isEmail()
        .withMessage(`Please enter a valid email address`),
    body("password")
        .notEmpty()
        .withMessage(`Password ${errsTxt.empty}`)
        .isLength({min:8})
        .withMessage(`Password ${errsTxt.length}`), 
    body("confirmPassword")
        .notEmpty()
        .withMessage(`Confirm Password ${errsTxt.empty}`)
        .isLength({min:8})
        .withMessage(`Confirm Password ${errsTxt.length}`)
        .custom((value, { req })=> {
            return value === req.body.password
        })
        .withMessage("Passwords did not match. Please try again")                      
]


const registerUser = [
    signUpValidator,
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(400).render("sign-up", {
                errors: errors.array()
            })
        }

        const {fullName, username,password} = req.body;
        await db.insertUser({fullName, username, password, membershipstatus: false});


        res.send("good work no errors")
    }
]


module.exports = {
    registerUser
}

