const dbStandard = require('./db-services/db-standard');
const dbPurchase = require('./db-services/db-purchase');
const orgConfig = require('../configs/org.config');
const config = require('../configs/config').config;
const {
  products,
  productcategories,
  productsubcategories,
  productrequisitions,
  productpurchases,
  credentials,
  storestocks,
  usertypes,
} = require('../database/models');
const { parseDateString } = require('./utils/helper');
const { Op } = require('sequelize');
const { sendSingleEmail } = require('./utils/send-email');

async function listAllProductCategories(req, res, next) {
  const productCategories = await dbStandard.joinFilterDb(
    productcategories,
    productsubcategories,
    {}
  );
  return res.json(productCategories);
}

async function listProductCategories(req, res, next) {
  const productCategories = await dbStandard.selectAllDb(productcategories);
  return res.json(productCategories);
}

async function addProductCategories(req, res, next) {
  const { category } = req.body;
  const addCategoryRes = await dbStandard.addSingleRecordDB(productcategories, {
    category,
  });
  return res.json(addCategoryRes);
}

async function editProductCategories(req, res, next) {
  const { id, category } = req.body;
  if (!id || !category)
    return res.json({ success: false, error: 'Missing required fields' });
  const addCategoryRes = await dbStandard.modifySingleRecordDb(
    productcategories,
    { id },
    {
      category,
    }
  );
  return res.json(addCategoryRes);
}

async function listProductSubcategories(req, res, next) {
  const productCategories = await dbStandard.selectAllDb(productsubcategories);
  return res.json(productCategories);
}

async function addProductSubcategories(req, res, next) {
  const { subcategory, categoryId } = req.body;
  const addCategoryRes = await dbStandard.addSingleRecordDB(
    productsubcategories,
    {
      subcategory: subcategory,
      category_id: categoryId,
    }
  );
  return res.json(addCategoryRes);
}

async function editProductSubcategories(req, res, next) {
  const { id, subcategory, categoryId } = req.body;
  if (!id || !subcategory || !categoryId)
    return res.json({ success: false, error: 'Missing required fields' });
  const addCategoryRes = await dbStandard.modifySingleRecordDb(
    productsubcategories,
    { id },
    {
      subcategory: subcategory,
      category_id: categoryId,
    }
  );
  return res.json(addCategoryRes);
}

async function listProducts(req, res, next) {
  const productsList = await dbPurchase.listProductsDb();
  return res.json(productsList);
}

async function addProducts(req, res, next) {
  const { name, unit, subcategoryId } = req.body;
  if (!name || !unit || !subcategoryId)
    return res.json({ success: false, error: 'Missing required fields' });
  const addProductRes = await dbStandard.addSingleRecordDB(products, {
    name: name,
    unit: unit,
    subcategory_id: subcategoryId,
  });
  return res.json(addProductRes);
}

async function editProducts(req, res, next) {
  const { id, name, unit, subcategoryId } = req.body;
  if (!id || !name || !unit || !subcategoryId)
    return res.json({ success: false, error: 'Missing required fields' });
  const addProductRes = await dbStandard.modifySingleRecordDb(
    products,
    { id },
    {
      name: name,
      unit: unit,
      subcategory_id: subcategoryId,
    }
  );
  return res.json(addProductRes);
}

async function addProductRequisition(req, res, next) {
  const { productId, quantity, notes, userId } = req.body;
  if (!productId || !quantity)
    return res.json({ success: false, error: 'Missing required fields' });
  const addProductRes = await dbStandard.addSingleRecordDB(
    productrequisitions,
    {
      product_id: productId,
      quantity: quantity,
      notes: notes,
      requester_id: userId,
      status: 'pending',
    }
  );
  customEmails({
    type: 'itemRequisition',
    status: 'Created',
    itemName: productId,
    userIds: userId,
  });
  return res.json(addProductRes);
}

async function editProductRequisition(req, res, next) {
  const { id, status, approverId, quantity, notes, usertypeId, productId } =
    req.body;
  if (!id || !status || !approverId)
    return res.json({ success: false, error: 'Missing required fields' });

  if (orgConfig.orgConfig.STORE_USER_TYPE.indexOf(usertypeId) === -1) {
    return res.json({
      success: false,
      message: 'User not authorized to fullfill requisition',
    });
  }

  try {
    const stockStatus = await dbStandard.findOneFilterDb(storestocks, {
      product_id: productId,
    });

    if (!stockStatus) {
      return res.json({
        success: false,
        message: 'Product not available in stock',
      });
    }

    if (
      Number(stockStatus.quantity) < Number(quantity) &&
      status === 'fullfilled'
    ) {
      return res.json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const editProductRes = await dbStandard.modifySingleRecordDb(
      productrequisitions,
      { id },
      {
        status: status,
        approver_id: approverId,
        quantity: quantity,
        notes: notes,
      }
    );

    if (status === 'fullfilled') {
      await dbStandard.modifySingleRecordDb(
        storestocks,
        { id: stockStatus.id },
        { quantity: stockStatus.quantity - quantity }
      );
    }
    customEmails({
      type: 'itemRequisition',
      status: status,
      itemName: productId,
      userIds: editProductRes.result[1][0].requester_id,
    });
    return res.json(editProductRes);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: error.message });
  }
}

async function listProductRequisitions(req, res, next) {
  const { status } = req.params;
  const productRequisitions = await dbPurchase.listProductRequisitionsDb(
    status
  );
  return res.json(productRequisitions);
}

async function listProductRequisitionsById(req, res, next) {
  const { productId } = req.params;
  const productRequisitions =
    await dbPurchase.listProductRequisitionsByProductIdDb(productId);
  return res.json(productRequisitions);
}

async function addProductPurchase(req, res, next) {
  const { productId, quantity, price, notes, userId } = req.body;
  if (!productId || !quantity || !price)
    return res.json({ success: false, message: 'Missing required fields' });
  const addProductRes = await dbStandard.addSingleRecordDB(productpurchases, {
    product_id: productId,
    quantity: quantity,
    price: price,
    notes: notes,
    requester_id: userId,
    status: 'pendingApproval',
  });
  customEmails({
    type: 'itemPurchase',
    status: 'Created',
    itemName: productId,
    userIds: userId,
  });
  return res.json(addProductRes);
}

async function editProductPurchase(req, res, next) {
  const { id, notes, userId, usertypeId, status, cost } = req.body;
  console.log('usertypeId: ', usertypeId);
  if (!id)
    return res.json({ success: false, message: 'Missing required fields' });

  const approverId = ['approved', 'rejected'].includes(status) ? userId : null;
  const actualCost = ['purchased'].includes(status) ? cost : null;

  if (
    ['released'].includes(status) &&
    orgConfig.orgConfig.FINANCE_USER_TYPE.indexOf(usertypeId) === -1
  ) {
    return res.json({
      success: false,
      message: 'User not authorized to release budget',
    });
  }

  if (
    ['purchased'].includes(status) &&
    orgConfig.orgConfig.STORE_USER_TYPE.indexOf(usertypeId) === -1
  ) {
    return res.json({
      success: false,
      message: 'User not authorized to complete purchase',
    });
  }

  if (
    ['approved', 'rejected'].includes(status) &&
    orgConfig.orgConfig.APPROVER_USER_TYPE.indexOf(usertypeId) === -1
  ) {
    return res.json({
      success: false,
      message: 'User not authorized to approve/reject requisition',
    });
  }

  try {
    const editProductRes = ['approved', 'rejected'].includes(status)
      ? await dbStandard.modifySingleRecordDb(
          productpurchases,
          { id },
          {
            notes: notes,
            approver_id: userId,
            status: status,
          }
        )
      : await dbStandard.modifySingleRecordDb(
          productpurchases,
          { id },
          {
            notes: notes,
            status: status,
            actual_cost: cost,
          }
        );

    if (['purchased'].includes(status)) {
      const stockStatus = await dbStandard.findOneFilterDb(storestocks, {
        product_id: editProductRes.result[1][0].product_id,
      });

      if (!stockStatus) {
        await dbStandard.addSingleRecordDB(storestocks, {
          product_id: editProductRes.result[1][0].product_id,
          quantity: editProductRes.result[1][0].quantity,
        });
      } else {
        await dbStandard.modifySingleRecordDb(
          storestocks,
          { id: stockStatus.id },
          {
            quantity:
              Number(stockStatus.quantity) +
              Number(editProductRes.result[1][0].quantity),
          }
        );
      }
    }
    customEmails({
      type: 'itemPurchase',
      status: status,
      itemName: editProductRes.result[1][0].product_id,
      userIds: editProductRes.result[1][0].requester_id,
    });
    return res.json(editProductRes);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: error.message });
  }
}

async function listProductPurchases(req, res, next) {
  const { status } = req.params;
  const productPurchases = await dbPurchase.listProductPurchasesDb(status);

  return res.json(productPurchases);
}

async function getStockStatus(req, res, next) {
  const { productId } = req.params;
  // const stockStatus = await dbStandard.findOneFilterDb(storestocks, {
  //   product_id: productId,
  // });
  const stockStatus = await dbStandard.joinFilterDb(
    storestocks,
    products,
    { product_id: productId },
    'product_id'
  );
  return res.json(stockStatus);
}

async function getFullStockStatus(req, res, next) {
  const stockStatus = await storestocks.findAll({
    include: [
      {
        model: products,
        attributes: ['name', 'unit'],
      },
    ],
  });
  return res.json(stockStatus);
}

async function daywiseItemReport(req, res, next) {
  const { startDate, endDate } = req.params;
  const itemFullfilled = await dbPurchase.itemWiseDailyFulfilled(
    startDate,
    endDate
  );
  const itemsPurchase = await dbPurchase.itemWiseDailyPurchased(
    startDate,
    endDate
  );

  return res.json({ itemFullfilled, itemsPurchase });
}

async function customEmails({ type, status, itemName, userIds }) {
  const mailSettings = [
    {
      type: 'itemRequisition',
      subject: 'Item Requisition',
      userTypes: ['Store Keeper', 'Store Executive'],
      link: 'purchase/item-requisition',
    },
    {
      type: 'itemPurchase',
      subject: 'Item Purchase',
      userTypes: [
        'Store Keeper',
        'Store Executive',
        'Managing Director',
        'Director',
        'Finance',
      ],
      link: 'purchase/item-purchase',
    },
  ];

  const emailIdOfUser = await credentials.findAll({
    where: {
      id: userIds,
    },
    attributes: ['email'],
  });

  const emailIdOfOthers = await credentials.findAll({
    include: [
      {
        model: usertypes,
        where: {
          user_type: mailSettings.find((mail) => mail.type === type).userTypes,
        },
      },
    ],
    attributes: ['email'],
  });

  const emailIds = [...emailIdOfUser, ...emailIdOfOthers];
  const selectedProduct = await products.findOne({
    where: {
      id: itemName,
    },
    attributes: ['name'],
  });

  const emailList = emailIds.map((email) => email.email).join(',');
  const mailSubject =
    'FNFGZ' +
    ': ' +
    mailSettings.find((mail) => mail.type === type).subject +
    ' - ' +
    status;
  const mailBody =
    mailSettings.find((mail) => mail.type === type).subject +
    ' for ' +
    selectedProduct.name +
    ' has been ' +
    status +
    '. You can check status in the following link. <br />' +
    '<br /><a href="' +
    config.APP_URL +
    '/' +
    mailSettings.find((mail) => mail.type === type).link +
    '" target="_blank" rel="noopener noreferrer">' +
    config.APP_URL +
    '/' +
    mailSettings.find((mail) => mail.type === type).link +
    '</a>';

  await sendSingleEmail(emailList, mailBody, mailSubject);
}

module.exports = {
  listAllProductCategories,
  addProductCategories,
  listProductCategories,
  editProductCategories,
  addProductSubcategories,
  listProductSubcategories,
  editProductSubcategories,
  listProducts,
  addProducts,
  editProducts,
  addProductRequisition,
  editProductRequisition,
  listProductRequisitions,
  listProductRequisitionsById,
  addProductPurchase,
  editProductPurchase,
  listProductPurchases,
  getStockStatus,
  getFullStockStatus,
  daywiseItemReport,
};
