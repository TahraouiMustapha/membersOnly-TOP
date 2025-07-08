

const {body, validationResult} = require("express-validator");

const errsTxt = {
    empty: "can not be empty"
}

const signUpValidator = [
    body("firstName")   
        .trim()
        .notEmpty()
        .withMessage(`first Name ${errsTxt.empty}`)
        .isBase32()
        .withMessage('wha')
]


const registerUser = [
    signUpValidator,
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors.array())
            return res.send("there are errors")
        }

        res.send("good work no errors")
    }
]


module.exports = {
    registerUser
}

