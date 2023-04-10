const dbConfig = {
    host: "localhost",
    port: 5432,
    user: "smarttaps",
    password: "beautifulcards",
    database: "smarttaps_db",

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