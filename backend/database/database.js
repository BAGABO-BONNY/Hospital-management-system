const { Pool } = require("pg")
const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"medcare",
    password:"co2hno3",
    port:5432
})

pool.connect()
    .then(client=>{
        console.log("Db connected successfully");
        client.release()
    }).catch(err=>{
        console.log("Db connection falied",err);
    })

module.exports = pool;