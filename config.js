const {Client} = require('pg')

const config = new Client({

    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '1234',
    database: 'parking',
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 30000,
    min: 10,
    max: 20,

})

module.exports = {config}