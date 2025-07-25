const pool = require("./pool")

async function insertUser ({fullName, username, password, membershipstatus}) {
    await pool.query(
        `INSERT INTO users (fullname, username, password, membershipstatus) 
            VALUES ($1, $2, $3, $4)`, 
        [fullName, username, password, membershipstatus]            
    )
} 

async function getUserByUserName(username) {
    const { rows } =  await pool.query (
        "SELECT * FROM users where username = $1", 
        [username]
    )

    return rows[0];
}

async function getUserById (id) {
    const { rows } = await pool.query(
        "SELECT * FROM users where userid = $1",
        [id]
    )

    return rows[0];
}

async function insertMessage({title, time, text, userid}) {
    await pool.query(
        `INSERT INTO messages(title, time, text, userid) 
        VALUES ($1, $2, $3, $4)`, 
        [title, time, text, userid]
    )
}

async function updateMemberShipStatus(userid) {
    await pool.query(
        `UPDATE users
        SET membershipstatus = true
        where userid = $1`, 
        [userid]
    )
}

async function getMessages() {
    const { rows } = await pool.query (
        `SELECT m.title, m.time, m.text , u.fullname from messages m 
        JOIN users u ON m.userid = u.userid;`
    )

    return rows;
}

module.exports = {
    insertUser, 
    getUserByUserName,
    getUserById, 
    insertMessage, 
    updateMemberShipStatus, 
    getMessages
}