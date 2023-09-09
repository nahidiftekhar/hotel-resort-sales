const dbStandard = require('./db-services/db-standard');
const dbPurchase = require('./db-services/db-purchase');
const orgConfig = require('../configs/org.config');
const {
  products,
  productcategories,
  productsubcategories,
  productrequisitions,
  productpurchases,
  credentials,
} = require('../database/models');

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
  const productsList = await dbStandard.selectAllDb(products);
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
  return res.json(addProductRes);
}

async function editProductRequisition(req, res, next) {
  const { id, status, approverId, quantity, notes, usertypeId } = req.body;
  if (!id || !status || !approverId)
    return res.json({ success: false, error: 'Missing required fields' });

  if (orgConfig.orgConfig.STORE_USER_TYPE.indexOf(usertypeId) === -1) {
    return res.json({
      success: false,
      message: 'User not authorized to fullfill requisition',
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
  return res.json(editProductRes);
}

async function listProductRequisitions(req, res, next) {
  const { status } = req.params;
  const productRequisitions = await dbPurchase.listProductRequisitionsDb(
    status
  );
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
    orgConfig.orgConfig.APPOVER_USER_ID.indexOf(userId) === -1
  ) {
    return res.json({
      success: false,
      message: 'User not authorized to approve/reject requisition',
    });
  }

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
  return res.json(editProductRes);
}

async function listProductPurchases(req, res, next) {
  const { status } = req.params;
  const productPurchases = await dbPurchase.listProductPurchasesDb(status);

  return res.json(productPurchases);
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
  addProductPurchase,
  editProductPurchase,
  listProductPurchases,
};
