const dbStandardServices = require("../services/utils/db-standard")
const {credentials, usertypes} = require("../database/models")

async function getAllUsers (req, res, next) {
    const dbResult = await dbStandardServices.selectAllDb(usertypes)
    return res.json(dbResult)
}

module.exports = {
    getAllUsers
}