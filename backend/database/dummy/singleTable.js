const { faker } = require("@faker-js/faker");

const TableToPopulate = require("../models");

const alacarteCategories = ['Appetizers' ,'Entrees' ,'Desserts' ,'Beverages' ,'Breakfast' ,'Lunch' ,'Dinner']
const prixFixeCategories = ['Lunch & Dinner', 'Gala Dinner', 'Snacks', 'Breakfast', 'Special Additional Items']
const userTypes = ['Owner', 'Sales Manager', 'Sales Executive']
const menuTypes =[
  {name: 'Regular', description: 'Regular items available at restaurant'},
  {name: 'Lunch', description: 'Lunch items available at restaurant'},
  {name: 'Dinner', description: 'Dinner items available at restaurant'},
  {name: 'Breakfast', description: 'Breakfast items available at restaurant'},
  {name: 'Preorder', description: 'Items available upon pre-order'},
  {name: 'Package Only', description: 'Included in package'},
];
const roomTypes = [
{name: 'ROYAL SUITE', tariff: 18000, occupancy: 3},
{name: 'EXECUTIVE SUITE', tariff: 14000, occupancy: 2},
{name: 'BHAWAL COTTAGE', tariff: 13000, occupancy: 6},
{name: 'PREMIUM DUPLEX VILLA', tariff: 11000, occupancy: 4},
{name: 'DUPLEX VILLA', tariff: 8000, occupancy: 3},
{name: 'FAMILY COTTAGE', tariff: 9000, occupancy: 2},
{name: 'WOODEN COTTAGE', tariff: 8000, occupancy: 2},
{name: 'PLATINUM KING', tariff: 9000, occupancy: 2},
{name: 'PREMIUM TWIN', tariff: 8000, occupancy: 2},
{name: 'DELUXE TWIN', tariff: 7500, occupancy: 2},
{name: 'OITIJO COTTAGE-3', tariff: 8000, occupancy: 3},
{name: 'OITIJO COTTAGE-2', tariff: 7500, occupancy: 2},
{name: 'Anonddo Cottage', tariff: 8000, occupancy: 2}
]
const packageTypes = ['Daylong Packages', 'Night Stay Packages']

packageTypes.map((type) => (
  TableToPopulate.packagecategories.create({
    name: type
  })
))

roomTypes.map(({name, tariff, occupancy}) => (
  TableToPopulate.roomtypes.create({
    room_type_name: name,
    max_adult: occupancy,
    price: tariff
  })
))

menuTypes.map((menuType) => (
  TableToPopulate.menus.create({
    name: menuType.name,
    description: menuType.description
  })
))

alacarteCategories.map((category) => (
  TableToPopulate.alacartecategories.create({
    name: category,
    description: category
  })
))

prixFixeCategories.map((category) => (
  TableToPopulate.prixfixecategories.create({
    name: category,
    description: category
  })
))

userTypes.map((type) => (
  TableToPopulate.usertypes.create({
    user_type: type,
  })
))


console.log('Done populating. please check database.');
// for (var i = 0; i < 90000; i++) {
//     TableToPopulate.create({
//       card_id: faker.helpers.arrayElement([10,19,14]),
//       action: faker.helpers.arrayElement(['Contact Profile', 'vCard', 'Whatsapp', 'Call Phone', 'SMS', 'Link Tree']),
//       time: faker.date.between('2022-03-01T00:00:00.000Z', '2023-03-20T00:00:00.000Z'),
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
//   });
// }

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

// menus: This table stores information about the different menus that are available. Each menu has a unique id, a name, and a description.

// alacarte_categories: This table stores information about the categories of items on each menu. Each category has a unique id, a name, and a menu_id foreign key to associate it with a specific menu.
// alacarte_items: This table stores information about the individual menu items that are available. Each menu item has a unique id, a name, a description, a price, and a category_id foreign key to associate it with a specific category.

// prixfixe_menus: This table stores information about the prix fixe menus that are available. Each prix fixe menu has a unique id, a name, a description, and a price.
// prixfixe_items: This table stores information about the individual items that are included in each prix fixe menu. Each item has a unique id, a name, a description, and a prix_fixe_menu_id foreign key to associate it with a specific prix fixe menu.
