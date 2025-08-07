const { Client } = require("pg")
require("dotenv").config()


const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
        username VARCHAR(255), 
        password VARCHAR(255), 
        fullname VARCHAR(100), 
        membershipstatus BOOLEAN, 
        admin BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS messages (
        messageid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
        title VARCHAR(255), 
        text VARCHAR(255), 
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        userid INTEGER, 
        FOREIGN KEY (userid) REFERENCES users(userid)
    );

    INSERT INTO users (username, password, fullname, membershipstatus, admin)
    VALUES 
    ('admin@gmail.com', 'securepassword123', 'John Admin', true, true),   
    ('mustapha@gmail.com', 'mypassword456', 'Jane Member', true, false); 

    INSERT INTO messages (title, text, userid)
    VALUES
    ('Welcome Message', 'Hello everyone! This is John, your admin.', 1),  
    ('First Post', 'Excited to be here and share ideas!', 2);

`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log('done')

}

main();
