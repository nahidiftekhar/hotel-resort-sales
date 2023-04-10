<<<<<<< HEAD
const dbConfig = {
    host: "localhost",
    port: 5432,
    user: "DB-USER-NAME",
    password: "DB-PASSWORD",
    database: "SCHEMA-NAME",

    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
}

module.exports = {
    dbConfig
=======
const dbConfig = {
    host: "localhost",
    port: 5432,
    user: "DB-USER-NAME",
    password: "DB-PASSWORD",
    database: "SCHEMA-NAME",

    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
}

module.exports = {
    dbConfig
>>>>>>> 011af36ede3115be1e8b55752f1bd5bca50d3e26
}