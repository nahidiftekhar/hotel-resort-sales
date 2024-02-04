const dbConfig = {
    host: "localhost",
    port: 5432,
    username: "emyl",
    password: "0206097",
    database: "todaroki",

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
}