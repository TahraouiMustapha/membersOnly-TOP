

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
    body("email")
        .trim()
        .notEmpty()
        .withMessage(`Username ${errsTxt.empty}`)
        .isEmail()
        .withMessage(`Please enter a valid email address`),
    body("password")
        .trim()
        .notEmpty()
        .withMessage(`Password ${errsTxt.empty}`)
        .isLength({min:8})
        .withMessage(`Password ${errsTxt.length}`), 
    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage(`Confirm Password ${errsTxt.empty}`)
        .isLength({min:8})
        .withMessage(`Confirm Password ${errsTxt.length}`),               
]


const registerUser = [
    signUpValidator,
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(400).render("sign-up", {
                errors: errors.array()
            })
        }

        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword
        if(password !== confirmPassword) {
            return res.status(400).render ("sign-up", {
                errors: [
                    { msg: "Passwords did not match. Please try again"}
                ]
            })
        }

        res.send("good work no errors")
    }
]


module.exports = {
    registerUser
}

