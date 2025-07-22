const db = require("../db/queries")
const asyncHandler = require("express-async-handler")

const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")

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
            return res.status(400).render("sign-up", {
                errors: errors.array()
            })
        }

        const {fullName, username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insertUser({fullName, username, password: hashedPassword, membershipstatus: false});


        res.send("good work no errors")
    }
]

const sendMsgValidate = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage(`Title ${errsTxt.empty}`), 
    body("text")
        .trim()
        .notEmpty()
        .withMessage(`Text ${errsTxt.empty}`)       
]

const createMsg = [
    sendMsgValidate, 
    asyncHandler(async (req, res)=> {
        const errors = validationResult(req)
        res.locals.user = req.user;
        
        if(!errors.isEmpty()) {
            return res.status(400).render("newMessage", {
                title: "New Message",
                errors: errors.array()
            })
        }

        const { title, text } = req.body;
        await db.insertMessage({title, time: new Date(), text, userid: req.user.userid});

        res.send("created succecfully")        
    })
]

module.exports = {
    registerUser, 
    createMsg
}

