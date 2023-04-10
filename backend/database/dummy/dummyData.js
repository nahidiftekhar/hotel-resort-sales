const {faker} = require("@faker-js/faker");

const UserType = require("../models/usertype.model");
const User = require("../models/user.model");
const VisitorRecord = require("../models/visitor.model");
const KnownRecord = require("../models/knownrecord.model");

module.exports = {
  async dummyData(req, res, next) {
    // await UserType.destroy({
    //     truncate: true
    //   });
    // const UserTypeInsert = await UserType.bulkCreate([
    //   { type: "staff" },
    //   { type: "VIP" },
    // ]);

    await User.destroy({
        // truncate: true
         truncate: { cascade: true } 
      });
    let UserInsert = 0;
    for (var i = 0; i < 4; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const photoLocation = faker.helpers.arrayElement([1,2,3,4]) + '.jpg';
      await User.create({
        type_id: faker.helpers.arrayElement([1,2]),
        email_id: faker.internet.email(firstName, lastName),
        name: faker.name.fullName({firstName: firstName, lastName: lastName}),
        photo_location: photoLocation
      });
      UserInsert = i+1;
    }


    await KnownRecord.destroy({
        truncate: true
    });
    let knownInsert = 0;
    for(var i=0; i<200; i++) {
      await KnownRecord.create({
        user_id: faker.helpers.arrayElement([1,2,3,4]),
        record_time: faker.datatype.datetime({min: 1675235686000, max:1676099686000})
      })
      knownInsert = i+1
    }

    await VisitorRecord.destroy({
        truncate: true
    });
    let visitorInsert=0;
    for(var i=0; i<5000; i++) {
      const visitorId = faker.helpers.arrayElement([1,2,3,4,5,6,7,8,9]);
      const photoLocation = visitorId + '.jpg';
      await VisitorRecord.create({
        visitor_id: visitorId,
        visitor_image: photoLocation,
        record_time: faker.datatype.datetime({min: 1675235686000, max:1676099686000})
      });
      visitorInsert = i+1;
    }

    return res.json({ UserInsert, knownInsert, visitorInsert});
  },
};
