const { faker } = require('@faker-js/faker');

const TableToPopulate = require('../models');

const alacarteCategories = [
  'Appetizers',
  'Entrees',
  'Desserts',
  'Beverages',
  'Breakfast',
  'Lunch',
  'Dinner',
];
const prixFixeCategories = [
  'Lunch & Dinner',
  'Gala Dinner',
  'Snacks',
  'Breakfast',
  'Special Additional Items',
];
const userTypes = ['Owner', 'Sales Manager', 'Sales Executive'];
const menuTypes = [
  { name: 'Regular', description: 'Regular items available at restaurant' },
  { name: 'Lunch', description: 'Lunch items available at restaurant' },
  { name: 'Dinner', description: 'Dinner items available at restaurant' },
  { name: 'Breakfast', description: 'Breakfast items available at restaurant' },
  { name: 'Preorder', description: 'Items available upon pre-order' },
  { name: 'Package Only', description: 'Included in package' },
];
const roomTypes = [
  { name: 'ROYAL SUITE', tariff: 18000, occupancy: 3 },
  { name: 'EXECUTIVE SUITE', tariff: 14000, occupancy: 2 },
  { name: 'BHAWAL COTTAGE', tariff: 13000, occupancy: 6 },
  { name: 'PREMIUM DUPLEX VILLA', tariff: 11000, occupancy: 4 },
  { name: 'DUPLEX VILLA', tariff: 8000, occupancy: 3 },
  { name: 'FAMILY COTTAGE', tariff: 9000, occupancy: 2 },
  { name: 'WOODEN COTTAGE', tariff: 8000, occupancy: 2 },
  { name: 'PLATINUM KING', tariff: 9000, occupancy: 2 },
  { name: 'PREMIUM TWIN', tariff: 8000, occupancy: 2 },
  { name: 'DELUXE TWIN', tariff: 7500, occupancy: 2 },
  { name: 'OITIJO COTTAGE-3', tariff: 8000, occupancy: 3 },
  { name: 'OITIJO COTTAGE-2', tariff: 7500, occupancy: 2 },
  { name: 'Anonddo Cottage', tariff: 8000, occupancy: 2 },
];
const packageTypes = ['Daylong Packages', 'Night Stay Packages'];

const menuPrimary = [
  'Arepas',
  'Barbecue Ribs',
  'Bruschette with Tomato',
  'Bunny Chow',
  'Caesar Salad',
  'California Maki',
  'Caprese Salad',
  'Cauliflower Penne',
  'Cheeseburger',
  'Chicken Fajitas',
  'Chicken Milanese',
  'Chicken Parm',
  'Chicken Wings',
  'Chilli con Carne',
  'Ebiten maki',
  'Fettuccine Alfredo',
  'Fish and Chips',
  'French Fries with Sausages',
  'French Toast',
  'Hummus',
  'Katsu Curry',
  'Kebab',
  'Lasagne',
  'Linguine with Clams',
  'Massaman Curry',
  'Meatballs with Sauce',
  'Mushroom Risotto',
  'Pappardelle alla Bolognese',
  'Pasta Carbonara',
  'Pasta and Beans',
  'Pasta with Tomato and Basil',
  'Peking Duck',
  'Philadelphia Maki',
  'Pho',
  'Pierogi',
  'Pizza',
  'Poke',
  'Pork Belly Buns',
  'Pork Sausage Roll',
  'Poutine',
  'Ricotta Stuffed Ravioli',
  'Risotto with Seafood',
  'Salmon Nigiri',
  'Scotch Eggs',
  'Seafood Paella',
  'Som Tam',
  'Souvlaki',
  'Stinky Tofu',
  'Sushi',
  'Tacos',
  'Teriyaki Chicken Donburi',
  'Tiramisù',
  'Tuna Sashimi',
  'Vegetable Soup',
];

const menuConjunction = [
  'featuring',
  'including',
  'alongside',
  'over',
  'on top of',
  'in addition to',
  'accompanied by',
  'served with',
  'garnished with',
  'topped with',
  'stuffed with',
  'filled with',
  'wrapped in',
  'coated in',
  'marinated in',
];

const menuAdjective = [
  'Crispy',
  'Savory',
  'Spicy',
  'Juicy',
  'Smoky',
  'Creamy',
  'Tangy',
  'Zesty',
  'Garlicky',
  'Cheesy',
  'Nutty',
  'Buttery',
  'Fluffy',
  'Tender',
  'Flavorful',
  'Grilled',
  'Roasted',
  'Fried',
  'Baked',
  'Sizzling',
];

const menuSecondary = [
  'Artichoke',
  'Arugula',
  'Asian Greens',
  'Asparagus',
  'Bean Shoots',
  'Bean Sprouts',
  'Beans',
  'Green beans',
  'Beetroot',
  'Bok Choy',
  'Broccoli',
  'Broccolini',
  'Brussels Sprouts',
  'Butternut lettuce',
  'Cabbage',
  'Capers',
  'Carob Carrot',
  'Carrot',
  'Cauliflower',
  'Celery',
  'Chilli Pepper',
  'Chinese Cabbage',
  'Fresh Chillies',
  'Dried Chinese Broccoli',
  'Cornichons',
  'Cos lettuce',
  'Cucumber',
  'Eggplant',
  'Endive',
  'English Spinach',
  'French eschallots',
  'Garlic',
  'Chives',
  'Green Pepper',
  'Hijiki',
  'Iceberg lettuce',
  'Jerusalem Artichoke',
  'Jicama',
  'Kale',
  'Kohlrabi',
  'Leeks',
  'Lettuce',
  'Onion',
  'Okra',
  'Parsnip',
  'Peas',
  'Peppers',
  'Potatoes',
  'Pumpkin',
  'Purple carrot',
  'Radicchio',
  'Radish',
  'Raspberry',
  'Red cabbage',
  'Red Pepper',
  'Rhubarb',
  'Snowpea sprouts',
  'Spinach',
  'Squash',
  'Sun dried tomatoes',
  'Sweet Potato',
  'Swiss Chard',
  'Turnips',
  'Zucchini',
];

const menuDescription = [
  'Three eggs with cilantro, tomatoes, onions, avocados and melted Emmental cheese. With a side of roasted potatoes, and your choice of toast or croissant.',
  'Three egg omelet with Roquefort cheese, chives, and ham. With a side of roasted potatoes, and your choice of toast or croissant.',
  'Three egg whites with spinach, mushrooms, caramelized onions, tomatoes and low-fat feta cheese. With herbed quinoa, and your choice of rye or whole-grain toast.',
  'Smoked salmon, poached eggs, diced red onions and Hollandaise sauce on an English muffin. With a side of roasted potatoes.',
  'Fresh parsley, Italian sausage, shallots, garlic, sun-dried tomatoes and mozzarella cheese in an all-butter crust. With a side of mixed fruits.',
  'Thick slices of French toast bread, brown sugar, half-and-half and vanilla, topped with powdered sugar. With two eggs served any style, and your choice of smoked bacon or smoked ham.',
  'Two buttermilk waffles, topped with whipped cream and maple syrup, a side of two eggs served any style, and your choice of smoked bacon or smoked ham.',
  'Breaded fried chicken with waffles, and a side of maple syrup.',
  'Two butter croissants of your choice (plain, almond or cheese). With a side of herb butter or house-made hazelnut spread.',
  '28-day aged 300g USDA Certified Prime Ribeye, rosemary-thyme garlic butter, with choice of two sides.',
  'Breaded fried chicken with waffles. Served with maple syrup.',
  'Fresh Norwegian salmon, lightly brushed with our herbed Dijon mustard sauce, with choice of two sides.',
  'Creamy mascarpone cheese and custard layered between espresso and rum soaked house-made ladyfingers, topped with Valrhona cocoa powder.',
  'Granny Smith apples mixed with brown sugar and butter filling, in a flaky all-butter crust, with ice cream.',
];

const prixfixeMenus = [
  {
    name: 'Vegetarian Thali Set Menu',
    description:
      'A selection of vegetarian dishes including dal, paneer, chana masala, mixed vegetable curry, raita, rice, naan bread and dessert.',
  },
  {
    name: 'Non-Vegetarian Thali Set Menu',
    description:
      'A selection of non-vegetarian dishes including chicken curry, lamb curry, fish curry, dal, raita, rice, naan bread and dessert.',
  },
  {
    name: 'Tandoori Set Menu',
    description:
      'A selection of tandoori dishes including tandoori chicken, chicken tikka, lamb seekh kebab, dal makhani, naan bread, raita and dessert.',
  },
  {
    name: 'Biryani Set Menu',
    description:
      'A selection of biryani dishes including chicken biryani, lamb biryani, vegetable biryani, raita, naan bread and dessert.',
  },
  {
    name: 'Punjabi Set Menu',
    description:
      'A selection of Punjabi dishes including butter chicken, dal makhani, aloo gobi, naan bread, raita and dessert.',
  },
  {
    name: 'South Indian Set Menu',
    description:
      'A selection of South Indian dishes including dosa, idli, sambar, chutney, vegetable curry, rice, naan bread and dessert.',
  },
  {
    name: 'Street Food Set Menu',
    description:
      'A selection of street food dishes including pani puri, samosas, bhel puri, chaat, naan bread and dessert.',
  },
  {
    name: "Chef's Special Set Menu",
    description:
      "A selection of the chef's special dishes including a mix of vegetarian and non-vegetarian dishes, naan bread, raita and dessert.",
  },
];

prixfixeMenus.map(({ name, description }) =>
  TableToPopulate.prixfixeitems.create({
    name: name,
    description: description,
    price: faker.datatype.float({ min: 100, max: 3500 }),
    image_url: faker.image.food(640, 480, true),
    category_id: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
  })
);

// packageTypes.map((type) =>
//   TableToPopulate.packagecategories.create({
//     name: type,
//   })
// );

// roomTypes.map(({ name, tariff, occupancy }) =>
//   TableToPopulate.roomtypes.create({
//     room_type_name: name,
//     max_adult: occupancy,
//     price: tariff,
//   })
// );

// menuTypes.map((menuType) =>
//   TableToPopulate.menus.create({
//     name: menuType.name,
//     description: menuType.description,
//   })
// );

// alacarteCategories.map((category) =>
//   TableToPopulate.alacartecategories.create({
//     name: category,
//     description: category,
//   })
// );

// prixFixeCategories.map((category) =>
//   TableToPopulate.prixfixecategories.create({
//     name: category,
//     description: category,
//   })
// );

// userTypes.map((type) =>
//   TableToPopulate.usertypes.create({
//     user_type: type,
//   })
// );

async function populateTable() {
  for (let i = 0; i < 99; i++) {
    TableToPopulate.alacarteitems.create({
      name:
        faker.helpers.arrayElement(menuPrimary) +
        ' ' +
        faker.helpers.arrayElement(menuConjunction) +
        ' ' +
        faker.helpers.arrayElement(menuAdjective) +
        ' ' +
        faker.helpers.arrayElement(menuSecondary),

      description:
        faker.helpers.arrayElement(menuAdjective) +
        ' ' +
        faker.helpers.arrayElement(menuDescription),
      price: faker.datatype.float({ min: 100, max: 3500 }),
      image_url: faker.image.food(640, 480, true),
      category_id: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7]),
    });
  }
}

// populateTable();

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
