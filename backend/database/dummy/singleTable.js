const { faker } = require("@faker-js/faker");

const TableToPopulate = require("../models/Events.model");
// const ActionLists = require("../models/ActionList.model");
// const Users = require("../models/Users.model");
// const Cards = require("../models/Cards.model");
// const Actions = require("../models/Actions.model");
// const Profiles = require("../models/Profiles.model");
// const ActivationCodes = require("../models/ActivationCodes.model");
// const UserActivationCodes = require("../models/UserActivationCodes.model");
// const Events = require("../models/Events.model");



for (var i = 0; i < 90000; i++) {
    TableToPopulate.create({
      card_id: faker.helpers.arrayElement([10,19,14]),
      action: faker.helpers.arrayElement(['Contact Profile', 'vCard', 'Whatsapp', 'Call Phone', 'SMS', 'Link Tree']),
      time: faker.date.between('2022-03-01T00:00:00.000Z', '2023-03-20T00:00:00.000Z'),
        // is_confirmed: faker.datatype.boolean(),
        // code: faker.random.alphaNumeric(20),
        // card_id: faker.datatype.number({min: 1, max: 9}),
        // // user_id: faker.datatype.number({min: 1, max: 6}),
        // card_link: cardCode,
        // group_id: faker.datatype.number({min: 1, max: 3}),
        // order_reference: faker.random.alphaNumeric(5),
        // order_email: faker.internet.email(firstName, lastName),
        // qr_code: cardCode,
        // card_tag: firstName,
        // action_id: faker.datatype.number({min: 1, max: 20}),
        // is_active: faker.datatype.boolean(),
        // is_blocked: faker.datatype.boolean(),
    });
  }


// TableToPopulate.destroy({
//         truncate: { cascade: true } 
//     });
    // const insertResult = TableToPopulate.bulkCreate([
    //     { action_name: "Contact Profile", action_icon: "profile.png" },
    //     { action_name: "Whatsapp", action_icon: "whatsapp.png" },
    //     { action_name: "Call", action_icon: "phone.png" },
    //     { action_name: "Contact Vcard", action_icon: "vcf.png" },
    //     { action_name: "URL", action_icon: "url.png" },
    //     { action_name: "SMS", action_icon: "sms.png" },
    //     { action_name: "Link Tree", action_icon: "link-tree.png" },
    // ]);
    // console.log("What happend is: " + insertResult);


