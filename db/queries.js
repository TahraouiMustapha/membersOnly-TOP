const pool = require("./pool")

async function insertUser ({fullName, username, password, membershipstatus}) {
    await pool.query(
        `INSERT INTO users (fullname, username, password, membershipstatus) 
            VALUES ($1, $2, $3, $4)`, 
        [fullName, username, password, membershipstatus]            
    )
} 



module.exports = {
    insertUser
}