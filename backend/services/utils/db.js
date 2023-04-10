const { Sequelize, Op } = require("sequelize");
const { dbConfig } = require("../../configs/db.config");
const Users = require("../../database/models/Users.model");
const Cards = require("../../database/models/Cards.model");
const Profiles = require("../../database/models/Profiles.model");
const ActionLists = require("../../database/models/ActionList.model");
const Actions = require("../../database/models/Actions.model");
const ActivationCodes = require("../../database/models/ActivationCodes.model");
const UserActivationCodes = require("../../database/models/UserActivationCodes.model");
const CardGroups = require("../../database/models/CardGroups.model");
const Events = require("../../database/models/Events.model");
const LinkTrees = require("../../database/models/LinkTree.model");
const Vcards = require("../../database/models/Vcards.model");

Users.hasMany(Cards, { foreignKey: "user_id" });
Cards.belongsTo(Users, { foreignKey: "user_id" });

Cards.hasMany(Actions, { foreignKey: "card_id" });
Actions.belongsTo(Cards, { foreignKey: "card_id" });

CardGroups.hasMany(Cards, { foreignKey: "group_id" });
Cards.belongsTo(CardGroups, { foreignKey: "group_id" });

ActionLists.hasMany(Actions, { foreignKey: "action_type_id" });
Actions.belongsTo(ActionLists, { foreignKey: "action_type_id" });

Actions.hasMany(Profiles, { foreignKey: "action_id" });
Profiles.belongsTo(Actions, { foreignKey: "action_id" });

Actions.hasMany(Vcards, { foreignKey: "action_id" });
Vcards.belongsTo(Actions, { foreignKey: "action_id" });

Actions.hasMany(LinkTrees, { foreignKey: "action_id" });
LinkTrees.belongsTo(Actions, { foreignKey: "action_id" });

Cards.hasMany(Events, { foreignKey: "card_id" });
Events.belongsTo(Cards, { foreignKey: "card_id" });

Cards.hasMany(ActivationCodes, { foreignKey: "card_id" });
ActivationCodes.belongsTo(Cards, { foreignKey: "card_id" });

Users.hasMany(UserActivationCodes, { foreignKey: "user_id" });
UserActivationCodes.belongsTo(Users, { foreignKey: "user_id" });

async function testQuery(param) {
  try {
    const results = await Cards.findAll({
      raw: true,
      where: {
        card_id: param,
      },
      attributes: [
        "card_id",
        "card_link",
        "cardgroup.group_link",
        "qr_code",
        "card_tag",
        "action_id",
        "is_active",
        "is_blocked",
        "actions.action_id",
        "actions->actionlist.action_name",
        "actions->actionlist.action_icon",
        "actions.action_attribute",
      ],
      include: [
        {
          model: CardGroups,
          attributes: [],
        },
        {
          model: Actions,
          attributes: [],
          // required: false,
          include: [
            {
              model: ActionLists,
              attributes: [],
            },
          ],
        },
      ],
    });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
  }
}

async function addCard(
  cardLink,
  groupId,
  orderEmail,
  qrCode,
  orderReference,
  activationCode
) {
  try {
    const result = await Cards.create({
      user_id: 1,
      card_link: cardLink,
      group_id: groupId,
      order_email: orderEmail,
      qr_code: qrCode,
      card_tag: "",
      action_id: 0,
      is_active: false,
      is_blocked: false,
      order_reference: orderReference,
    });
    await ActivationCodes.create({
      card_id: result.card_id,
      code: activationCode,
      is_confirmed: false,
    });
    return result;
  } catch (error) {
    console.log("Error while adding card: " + error);
    return error;
  }
}

async function getCardStatus(cardLink) {
  try {
    const result = await Cards.findOne({
      where: { card_link: cardLink },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getCardDetail(param) {
  try {
    const results = await Cards.findAll({
      raw: true,
      where: {
        card_link: param,
      },
      attributes: [
        "card_id",
        "card_link",
        "cardgroup.group_link",
        "qr_code",
        "card_tag",
        ["action_id", "active_action"],
        "is_active",
        "is_blocked",
        "is_pro",
        "actions.action_id",
        "actions.action_type_id",
        "actions.action_tag",
        "actions->actionlist.action_name",
        "actions->actionlist.action_icon",
        "actions.action_attribute",
        "user.username",
        "user.user_id",
        "view_password",
      ],
      include: [
        {
          model: CardGroups,
          attributes: [],
        },
        {
          model: Users,
          attributes: [],
        },
        {
          model: Actions,
          attributes: [],
          include: [
            {
              model: ActionLists,
              attributes: [],
            },
          ],
        },
      ],
      order: [[{ model: Actions }, "action_id", "DESC"]],
    });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
    return error;
  }
}

async function blockCard(cardId) {
  try {
    const result = await Cards.update(
      { is_blocked: true },
      {
        where: {
          card_id: cardId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error while blocking card: " + error);
    return error;
  }
}

async function unblockCard(cardId) {
  try {
    const result = await Cards.update(
      { is_blocked: false },
      {
        where: {
          card_id: cardId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error while unblocking card: " + error);
    return error;
  }
}

async function proCardDb(cardId) {
  try {
    const result = await Cards.update(
      { is_pro: true },
      {
        where: {
          card_id: cardId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error while blocking card: " + error);
    return error;
  }
}

async function unproCardDb(cardId) {
  try {
    const result = await Cards.update(
      { is_pro: false },
      {
        where: {
          card_id: cardId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error while unblocking card: " + error);
    return error;
  }
}

async function listCards(userId) {
  try {
    const results = userId
      ? await Cards.findAll({
          raw: true,
          where: {
            user_id: userId,
          },
          attributes: [
            "card_link",
            "card_tag",
            "is_active",
            "is_blocked",
            "cardgroup.group_link",
            "user.registered_email",
            "user.username",
          ],
          include: [
            {
              model: CardGroups,
              attributes: [],
            },
            {
              model: Users,
              attributes: [],
            },
          ],
        })
      : await Cards.findAll({
          raw: true,
          attributes: [
            "card_link",
            "card_tag",
            "is_active",
            "is_blocked",
            "cardgroup.group_link",
            "cardgroup.group_name",
            "user.registered_email",
            "user.username",
          ],
          include: [
            {
              model: CardGroups,
              attributes: [],
            },
            {
              model: Users,
              attributes: [],
            },
          ],
        });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
  }
}

async function activateCard(cardLink, activationCode, userId) {
  if (!cardLink || !activationCode || !userId)
    return { success: 0, msg: "Please provide all input correctly." };
  let cardCount;
  try {
    cardCount = await Cards.findOne({
      where: { card_link: cardLink },
    });
    if (!cardCount) return { success: 0, msg: "Wrong card link!" };
    else if (cardCount.user_id > 1)
      return { success: 0, msg: "Card already assigned to a user." };
  } catch (error) {
    console.log("Error executing query: " + error);
    return { success: 0, msg: error };
  }
  try {
    const matchCode = await ActivationCodes.count({
      where: {
        card_id: cardCount.card_id,
        code: activationCode,
        is_confirmed: false,
      },
    });
    if (matchCode) {
      let activateCardResult;
      try {
        activateCardResult = await Cards.update(
          {
            is_active: true,
            user_id: userId,
          },
          {
            where: {
              card_id: cardCount.card_id,
              is_blocked: false,
            },
          }
        );
      } catch (error) {
        console.log("Error occured: " + error);
        return { success: 0, msg: error };
      }
      if (activateCardResult) {
        await ActivationCodes.update(
          { is_confirmed: true },
          {
            where: {
              card_id: cardCount.card_id,
              code: activationCode,
              is_confirmed: false,
            },
          }
        );
        return { success: 1, msg: activateCardResult };
      }
    } else return { success: 0, msg: "Activation code mismatch!" };
  } catch (error) {
    console.log("Error occured: " + error);
    return { success: 0, msg: error };
  }
}

async function editSingleCard(cardId, cardTag, cardLink, isActive) {
  try {
    const linkTaken = await Cards.count({
      where: {
        card_link: cardLink,
        card_id: {
          [Op.ne]: cardId,
        },
      },
    });
    if (linkTaken) return { status: 0, msg: "Link already taken" };
    try {
      const result = await Cards.update(
        {
          card_link: cardLink,
          card_tag: cardTag,
          is_active: isActive,
        },
        {
          where: { card_id: cardId },
        }
      );
      return { status: 1, msg: result };
    } catch (error) {
      console.log("Error executing query: " + error);
      return { status: 0, msg: error };
    }
  } catch (error) {
    console.log("Error executing query: " + error);
    return { status: 0, msg: error };
  }
}

async function findUserByEmail(email) {
  try {
    const results = await Users.findOne({ where: { registered_email: email } });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
  }
}

async function addNewUser(type_id, email_id, pass_token, userName) {
  try {
    const result = await Users.create({
      user_type: type_id,
      username: userName,
      registered_email: email_id,
      password: pass_token,
      is_deactive: true,
    });
    return { status: 1, result };
  } catch (error) {
    console.log("Error occured: " + error);
    return { status: 0, error };
  }
}

async function addUserVerificationToken(user_id, token) {
  await UserActivationCodes.destroy({
    where: {
      user_id: user_id,
    },
  });
  try {
    await UserActivationCodes.create({
      user_id: user_id,
      token: token,
      validity: Date.now() + 172800000,
      is_confirmed: false,
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

async function validateUserToken(token, userId) {
  try {
    const matchCode = await UserActivationCodes.count({
      where: {
        token: token,
        user_id: userId,
        is_confirmed: false,
        validity: { [Op.gt]: Date.now() },
      },
    });
    if (matchCode) {
      await UserActivationCodes.update(
        { is_confirmed: true },
        {
          where: {
            token: token,
            user_id: userId,
          },
        }
      );
      await Users.update(
        { is_deactive: false },
        {
          where: {
            user_id: userId,
          },
        }
      );
      return 1;
    }
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function getTokenbyEmail(email) {
  try {
    const matchCode = await UserActivationCodes.findOne({
      raw: true,
      attributes: ["token", "user.user_id"],
      include: {
        model: Users,
        where: {
          registered_email: email,
        },
        attributes: [],
      },
    });
    return matchCode;
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function addPasswordToken(user_id, token) {
  await UserActivationCodes.destroy({
    where: {
      user_id: user_id,
    },
  });
  try {
    await UserActivationCodes.create({
      user_id: user_id,
      token: token,
      is_confirmed: false,
      validity: Date.now() + 3600000,
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

async function findPasswordToken(token) {
  try {
    const results = await UserActivationCodes.findOne({
      where: {
        token: token,
        is_confirmed: false,
        validity: { [Op.gt]: Date.now() },
      },
    });
    return results;
  } catch (error) {
    console.log("Error occured: " + error);
    return 0;
  }
}

async function updatePassword(new_password, userId) {
  try {
    await Users.update(
      { password: new_password },
      { where: { user_id: userId } }
    );
    await UserActivationCodes.update(
      { is_confirmed: true },
      {
        where: {
          user_id: userId,
        },
      }
    );
    return 1;
  } catch (error) {
    console.log("Error changing password: " + error);
    return 0;
  }
}

async function addAction(actionType, cardId, actionAttribute, actionName) {
  try {
    const result = await Actions.create({
      action_type_id: actionType,
      card_id: cardId,
      action_attribute: actionAttribute,
      action_tag: actionName,
    });
    return result;
  } catch (error) {
    console.log("Error adding action: " + error);
    return 0;
  }
}

async function deleteAction(actionId) {
  try {
    const result = await Actions.destroy({
      where: {
        action_id: actionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function editAction(actionId, cardId, actionAttribute, actionName) {
  try {
    const result = await Actions.update(
      {
        action_attribute: actionAttribute,
        action_tag: actionName,
      },
      {
        where: {
          action_id: actionId,
          card_id: cardId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error updating action: " + error);
    return 0;
  }
}

async function getSingleAcion(cardId, actionTypeId) {
  try {
    const result = await Actions.findOne({
      where: { card_id: cardId, action_type_id: actionTypeId },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getSingleAcionbyId(actionId) {
  try {
    const result = await Actions.findOne({
      where: { action_id: actionId },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function defaultAction(cardId, actionId) {
  try {
    const result = await Cards.update(
      {
        action_id: actionId,
      },
      {
        where: { card_id: cardId },
      }
    );
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultActionType(actionId) {
  try {
    const result = await Actions.findOne({
      attributes: ["action_type_id"],
      where: { action_id: actionId },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultActionDb(cardId) {
  try {
    const cardResult = await Cards.findOne({
      where: {
        card_id: cardId,
      },
    });
    const results = await Actions.findOne({
      raw: true,
      where: { action_id: cardResult.action_id },
      attributes: [
        "action_id",
        "action_attribute",
        "actionlist.action_name",
        "actionlist.action_type_id",
      ],
      include: [
        {
          model: ActionLists,
          attributes: [],
        },
      ],
    });
    return results;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function addProfile(actionId, actionAttribute) {
  const contactInfo = Object.fromEntries(
    Object.entries(actionAttribute.attributes).filter(([key]) =>
      key.includes("contact")
    )
  );
  const basicInfo = Object.fromEntries(
    Object.entries(actionAttribute.attributes).filter(([key]) =>
      ["name", "address", "title", "organization", "aboutme"].includes(key)
    )
  );
  const otherInfo = actionAttribute.attributes.free_links;
  const themeElement = actionAttribute.attributes.theme_element;
  try {
    const result = await Profiles.create({
      action_id: actionId,
      profile_image: actionAttribute.image,
      basic_info: basicInfo,
      vcard_id: actionAttribute.attributes.vcard_id,
      contact_info: contactInfo,
      other_info: otherInfo,
      theme_element: themeElement,
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function editProfile(actionId, actionAttribute) {
  const contactInfo = Object.fromEntries(
    Object.entries(actionAttribute.attributes).filter(([key]) =>
      key.includes("contact")
    )
  );
  const basicInfo = Object.fromEntries(
    Object.entries(actionAttribute.attributes).filter(([key]) =>
      ["name", "address", "title", "organization", "aboutme"].includes(key)
    )
  );
  const otherInfo = actionAttribute.attributes.free_links;
  const themeElement = actionAttribute.attributes.theme_element;
  try {
    const result = await Profiles.update(
      {
        profile_image: actionAttribute.image,
        basic_info: basicInfo,
        vcard_id: actionAttribute.attributes.vcard_id,
        contact_info: contactInfo,
        other_info: otherInfo,
        theme_element: themeElement,
      },
      {
        where: {
          action_id: actionId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getProfileById(actionId) {
  try {
    const result = await Profiles.findOne({
      raw: true,
      where: {
        action_id: actionId,
      },
      attributes: [
        "action.action_id",
        "action.action_type_id",
        "action.card_id",
        "action.action_attribute",
        "action.action_tag",
        "theme_element",
        ["profile_image", "image_file"],
        "vcard_id",
        "basic_info",
        "contact_info",
        "other_info",
      ],
      include: [
        {
          model: Actions,
          attributes: [],
        },
      ],
    });
    const { basic_info, contact_info, other_info, ...restOf } = result;
    const deconsResult = {
      ...restOf,
      ...basic_info,
      ...contact_info,
    };
    return { ...deconsResult, other_info };
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function addVcard(actionId, actionAttribute) {
  try {
    const result = await Vcards.create({
      action_id: actionId,
      profile_image: actionAttribute.image,
      vcard_attribute: actionAttribute.attributes,
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function editVcard(actionId, actionAttribute) {
  try {
    const result = await Vcards.update(
      {
        profile_image: actionAttribute.image,
        vcard_attribute: actionAttribute.attributes,
      },
      {
        where: {
          action_id: actionId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getVcardById(actionId) {
  try {
    const result = await Vcards.findOne({
      raw: true,
      where: {
        action_id: actionId,
      },
      attributes: [
        "action.action_id",
        "action.action_type_id",
        "action.card_id",
        "action.action_attribute",
        "action.action_tag",
        ["profile_image", "image_file"],
        "vcard_attribute",
      ],
      include: [
        {
          model: Actions,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function addLinkTree(actionId, actionAttribute) {
  try {
    const result = await LinkTrees.create({
      action_id: actionId,
      display_name: actionAttribute.displayName,
      about_me: actionAttribute.aboutMe,
      image_file: actionAttribute.image,
      action_attribute: actionAttribute.attributes,
      theme_element: actionAttribute.themeElement,
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function editLinkTree(actionId, actionAttribute) {
  try {
    const result = await LinkTrees.update(
      {
        display_name: actionAttribute.displayName,
        about_me: actionAttribute.aboutMe,
        image_file: actionAttribute.image,
        action_attribute: actionAttribute.attributes,
        theme_element: actionAttribute.themeElement,
      },
      {
        where: {
          action_id: actionId,
        },
      }
    );
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getLinkTree(cardId, actionTypeId) {
  try {
    const result = await LinkTrees.findOne({
      raw: true,
      attributes: [
        "action.action_id",
        "action.action_type_id",
        "action.card_id",
        "action.action_attribute",
        "display_name",
        "image_file",
        "theme_element",
        ["action_attribute", "link_attribute"],
      ],
      include: [
        {
          model: Actions,
          where: {
            card_id: cardId,
          },
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getLinkTreeById(actionId) {
  try {
    const result = await LinkTrees.findOne({
      raw: true,
      where: {
        action_id: actionId,
      },
      attributes: [
        "action.action_id",
        "action.action_type_id",
        "action.card_id",
        "action.action_attribute",
        "action.action_tag",
        "display_name",
        "about_me",
        "image_file",
        ["action_attribute", "link_attribute"],
      ],
      include: [
        {
          model: Actions,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultActionId(cardLink) {
  try {
    const result = await Cards.findOne({
      where: {
        card_link: cardLink,
      },
      attributes: ["action_id"],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultActionDetail(actionId) {
  try {
    const result = await Actions.findOne({
      raw: true,
      where: {
        action_id: actionId,
      },
      attributes: ["action_id", "action_attribute", "actionlist.action_name"],
      include: [
        {
          model: ActionLists,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultLinkTree(actionId) {
  try {
    const result = await LinkTrees.findOne({
      where: {
        action_id: actionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultVcard(actionId) {
  try {
    const result = await Vcards.findOne({
      where: {
        action_id: actionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getDefaultProfile(actionId) {
  try {
    const result = await Profiles.findOne({
      where: {
        action_id: actionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getAllActionTypes() {
  try {
    const result = await ActionLists.findAll({
      attributes: [
        ["action_type_id", "actionTypeId"],
        ["action_name", "actionName"],
        ["action_icon", "actionIcon"],
      ],
      order: ["action_name"],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getActionTypeById(actionId) {
  try {
    const result = await Actions.findOne({
      attributes: [
        ["actionlist.action_type_id", "actionTypeId"],
        ["actionlist.action_name", "actionName"],
      ],
      where: { action_id: actionId },
      include: [
        {
          model: ActionLists,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function addEventDb(cardId, actionName) {
  try {
    const result = await Events.create({
      card_id: cardId,
      action: actionName,
      time: Date.now(),
      origin: "",
      headers: "",
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getStatByCardIdDb(cardId) {
  try {
    const todayCount = await Events.count({
      where: {
        card_id: cardId,
        time: {
          [Op.gte]: Sequelize.literal("Now() - INTERVAL '1d'"),
        },
      },
    });
    const yesterdayCount = await Events.count({
      where: {
        card_id: cardId,
        time: {
          [Op.gte]: Sequelize.literal("Now() - INTERVAL '2d'"),
          [Op.lt]: Sequelize.literal("Now() - INTERVAL '1d'"),
        },
      },
    });
    const weeklyCount = await Events.count({
      where: {
        card_id: cardId,
        time: {
          [Op.gte]: Sequelize.literal("Now() - INTERVAL '7d'"),
        },
      },
    });

    const monthlyCount = await Events.count({
      where: {
        card_id: cardId,
        time: {
          [Op.gte]: Sequelize.literal("Now() - INTERVAL '30d'"),
        },
      },
    });

    const totalCount = await Events.count({
      where: {
        card_id: cardId,
      },
    });
    const lastActionDay = await Events.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("time")), "max"]],
      where: {
        card_id: cardId,
      },
    });

    return {
      todayCount,
      yesterdayCount,
      weeklyCount,
      monthlyCount,
      totalCount,
      lastActionDay,
    };
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function dailyStatByCardIdDb(cardId, startDate, endDate) {
  const searchStartDate = new Date(startDate);
  let searchEndDate = new Date(endDate);
  searchEndDate.setDate(searchEndDate.getDate()+1);
  try {
    const result = await Events.findAll({
      attributes: [
        [Sequelize.fn('date', Sequelize.col('time')), "action_date"],
        [Sequelize.fn("COUNT", "1"), "CountedValue"]
      ],
      where: {
        [Op.and]: [
          {card_id: cardId},
          {
            time: {[Op.between]: [searchStartDate, searchEndDate]}
          }
        ]
      },
      group: [Sequelize.fn('date', Sequelize.col('time'))],
      order: [[Sequelize.col("action_date"), "DESC"]]
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function actionStatByCardIdDb(cardId, startDate, endDate) {
  const searchStartDate = new Date(startDate);
  let searchEndDate = new Date(endDate);
  searchEndDate.setDate(searchEndDate.getDate()+1);
  try {
    const result = await Events.findAll({
      attributes: [
        "action",
        [Sequelize.fn("COUNT", "1"), "CountedValue"]
      ],
      where: {
        [Op.and]: [
          {card_id: cardId},
          {
            time: {[Op.between]: [searchStartDate, searchEndDate]}
          }
        ]
      },
      group: ["action"],
      order: [["CountedValue", "DESC"]]
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function listAllCardsDb() {
  try {
    const result = await Cards.findAll({
      raw: true,
      attributes: [
        "card_id",
        "card_link",
        "order_reference",
        "order_email",
        "is_blocked",
        "user.registered_email",
        "activationcodes.code",
        "activationcodes.is_confirmed",
      ],
      include: [
        {
          model: Users,
          attributes: [],
        },
        {
          model: ActivationCodes,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

async function getCardInfoByCardLinkDB(cardLink) {
  try {
    const result = await Cards.findOne({
      raw: true,
      where: { card_link: cardLink },
      attributes: [
        "cards.createdAt",
        "cards.order_email",
        "cards.order_reference",
        "cards.card_link",
        "cards.is_active",
        "cards.is_blocked",
        "cards.is_pro",
        "cards.qr_code",
        "cards.card_id",
        "cardgroup.group_link",
        "user.registered_email",
        "activationcodes.code",
        "activationcodes.updatedAt",
        "activationcodes.is_confirmed",
      ],
      include: [
        {
          model: CardGroups,
          attributes: [],
        },
        {
          model: Users,
          attributes: [],
        },
        {
          model: ActivationCodes,
          attributes: [],
        },
      ],
    });
    return result;
  } catch (error) {
    console.log("Error executing query: " + error);
    return 0;
  }
}

module.exports = {
  testQuery,
  addCard,
  getCardDetail,
  getCardStatus,
  listCards,
  listAllCardsDb,
  blockCard,
  unblockCard,
  proCardDb,
  unproCardDb,
  activateCard,
  editSingleCard,
  findUserByEmail,
  addNewUser,
  addUserVerificationToken,
  validateUserToken,
  getTokenbyEmail,
  addPasswordToken,
  findPasswordToken,
  updatePassword,
  addAction,
  deleteAction,
  editAction,
  getSingleAcion,
  getSingleAcionbyId,
  addProfile,
  editProfile,
  getProfileById,
  defaultAction,
  getDefaultActionType,
  getDefaultActionDb,
  addLinkTree,
  getLinkTree,
  getLinkTreeById,
  editLinkTree,
  addVcard,
  editVcard,
  getVcardById,
  getDefaultActionId,
  getDefaultActionDetail,
  getDefaultLinkTree,
  getDefaultVcard,
  getDefaultProfile,
  getAllActionTypes,
  getActionTypeById,
  addEventDb,
  getStatByCardIdDb,
  dailyStatByCardIdDb,
  actionStatByCardIdDb,
  getCardInfoByCardLinkDB,
};
