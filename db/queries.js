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

module.exports = {
    insertUser, 
    getUserByUserName,
    getUserById
}