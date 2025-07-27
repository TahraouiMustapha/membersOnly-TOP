const db = require("../db/queries")
const asyncHandler = require("express-async-handler")

const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

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


        res.redirect('/');
    }
]

// create message form validation
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

// join the club form validation
const clubPasscode = 'membersOnly';

const joinValidate = body("passcode")
                        .trim()
                        .notEmpty()
                        .withMessage(`Passcode ${errsTxt.empty}`)
                        .custom(value => {
                            if(value !== clubPasscode) {
                                throw new Error("Incorrect Passcode!")
                            }
                            return true;
                        })


const joinTheClub = [
    joinValidate, 
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).render("join-the-club", {
                title: "Join The Club",
                user: req.user,
                errors: errors.array()
            })
        }

        const { userid } = req.user;
        await db.updateMemberShipStatus( userid );

        res.redirect('/')
    })
]

// be an admin form validation
const adminPasscode = 'i am an admin';

const adminValidate = body("passcode")
                        .trim()
                        .notEmpty()
                        .withMessage(`Passcode ${errsTxt.empty}`)
                        .custom (value => {
                            if(value !== adminPasscode) {
                                throw new Error("Incorrect Passcode!")
                            }
                        
                            return true;
                        })


const beAnAdmin = [
    adminValidate , 
    asyncHandler(async (req, res)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).render("be-an-admin", {
                title: "Be An Admin", 
                errors : errors.array()
            })
        }

        const { userid } = req.user; 
        await db.updateAdminStatus( userid );

        res.redirect('/')
    })
]                        

const deleteMsg = asyncHandler(async (req, res)=> {
    const { messageid } = req.params;

    await db.deleteMsg(messageid)

    res.redirect('/')
})

// display all msgs
const mainPage = asyncHandler(async (req, res)=> {
    const msgs = await db.getMessages();

    
    res.render("main", { 
        title: "Members Only", 
        messages : msgs
    })
})

module.exports = {
    registerUser, 
    createMsg, 
    joinTheClub, 
    beAnAdmin,
    deleteMsg,
    mainPage
}

