const db = require("./utils/db");
const conf = require("../configs/config");
// const url = require("url");

async function presentAction(req, res, next) {
  const { cardLink } = req.params;
  const cardDetail = await db.getCardStatus(cardLink);

  //Check card status and render
  if (!cardDetail) res.render("card-status", { cardCnt: 0 });
  else if (
    !cardDetail.is_active ||
    cardDetail.is_blocked ||
    cardDetail.user_id === 1
  ) {
    res.render("card-status", {
      cardCnt: 1,
      isActive: cardDetail.is_active,
      isBlocked: cardDetail.is_blocked,
      userId: cardDetail.user_id,
      cardLink: cardLink,
      baseUrl: conf.config.APP_URL,
    });
  } else {
    const defaultActionId = await db.getDefaultActionId(cardLink);
    
    //If no action is defined for a card
    if (!defaultActionId.action_id)
    res.render("no-action", {
      baseUrl: conf.config.APP_URL,
    });
    else {
      const defaultActionDetail = await db.getDefaultActionDetail(
        defaultActionId.action_id
        );
        
      await db.addEventDb(cardDetail.card_id, defaultActionDetail.action_name);
      switch (defaultActionDetail.action_name) {
        case "Whatsapp":
          res.redirect(
            `https://wa.me/${defaultActionDetail.action_attribute.replace(
              /\D/g,
              ""
            )}`
          );
          break;

        case "Call Phone":
          res.redirect(`tel: ${defaultActionDetail.action_attribute}`);
          break;

        case "Send SMS":
          res.redirect(`sms: ${defaultActionDetail.action_attribute}`);
          break;

        case "Custom URL":
          res.redirect(
            `http://${defaultActionDetail.action_attribute.replace(
              /(^\w+:|^)\/\//,
              ""
            )}`
          );
          break;

        case "Link Tree":
          const linkTreeDetail = await db.getDefaultLinkTree(
            defaultActionId.action_id
          );
          linkTreeDetail.action_attribute.map((obj) => {
            if (!isNaN(obj.link))
              obj.link = `${req.headers.host}/action/${obj.link}`;
            return obj;
          });
          res.render("link-tree", {
            links: linkTreeDetail.action_attribute,
            displayName: linkTreeDetail.display_name,
            aboutMe: linkTreeDetail.about_me,
            backgroundColor: linkTreeDetail.theme_element,
            imageFile: `/static/images/profiles/${linkTreeDetail.image_file}`,
          });
          break;

        case "vCard":
          var vCardsJS = require("vcards-js");
          const vcardDetail = await db.getDefaultVcard(
            defaultActionId.action_id
          );
          const vcardAttributes = vcardDetail.vcard_attribute;



          //create a new vCard
          const vCard = vCardsJS();

          //set properties
          vCard.firstName = vcardAttributes.firstName;
          vCard.lastName = vcardAttributes.lastName;
          vCard.namePrefix = vcardAttributes.namePrefix;
          vCard.homePhone = vcardAttributes.homePhone;
          vCard.cellPhone = vcardAttributes.cellPhone;
          vCard.workPhone = vcardAttributes.workPhone;
          vCard.email = vcardAttributes.email;
          vCard.workEmail = vcardAttributes.workEmail;
          vCard.secondEmail = vcardAttributes.secondEmail;
          vCard.organization = vcardAttributes.organization;
          vCard.title = vcardAttributes.title;
          vCard.url = vcardAttributes.url;
          vCard.workUrl = vcardAttributes.workUrl;
          vCard.gender = vcardAttributes.gender;
          vCard.homeFax = vcardAttributes.homeFax;
          vCard.pagerPhone = vcardAttributes.pagerPhone;
          vCard.homeAddress.city = vcardAttributes["homeAddress.city"];
          vCard.homeAddress.countryRegion =
            vcardAttributes["homeAddress.countryRegion"];
          vCard.homeAddress.label = vcardAttributes["homeAddress.label"];
          vCard.homeAddress.postalCode =
            vcardAttributes["homeAddress.postalCode"];
          vCard.homeAddress.stateProvince =
            vcardAttributes["homeAddress.stateProvince"];
          vCard.homeAddress.street = vcardAttributes["homeAddress.street"];
          vCard.workAddress.city = vcardAttributes["workAddress.city"];
          vCard.workAddress.countryRegion =
            vcardAttributes["workAddress.countryRegion"];
          vCard.workAddress.label = vcardAttributes["workAddress.label"];
          vCard.workAddress.postalCode =
            vcardAttributes["workAddress.postalCode"];
          vCard.workAddress.stateProvince =
            vcardAttributes["workAddress.stateProvince"];
          vCard.workAddress.street = vcardAttributes["workAddress.street"];

          if(vcardDetail.profile_image)
          vCard.photo.embedFromFile(
            `public/images/profiles/${vcardDetail.profile_image}`
          );

          //set content-type and disposition including desired filename
          res.set(
            "Content-Type",
            `text/vcard; name="${vcardAttributes.firstName}-${vcardAttributes.lastName}.vcf"`
          );
          res.set(
            "Content-Disposition",
            `inline; filename="${vcardAttributes.firstName}-${vcardAttributes.lastName}.vcf"`
          );
          //send the response
          res.send(vCard.getFormattedString());

          break;

        case "Contact Profile":
          const profileDetails = await db.getDefaultProfile(
            defaultActionId.action_id
          );

          //Link correction
          profileDetails.other_info.map((obj) => {
            obj.link = obj.link.replace(/(^\w+:|^)\/\//, "");

            if (obj.is_action === 1)
              obj.link = `${req.headers.host}/action/${obj.link}`;
            return obj;
          });

          //New object for textareas
          const textAreas = profileDetails.other_info.filter(
            (x) => x.is_action === 2
          );

          //fix for whatsapp
          profileDetails.contact_info.contactwhatsapp =
            profileDetails.contact_info.contactwhatsapp?.replace(/\D/g, "");

          //fix for map link
          profileDetails.contact_info.contactfb = profileDetails.contact_info.contactfb ? 
            profileDetails.contact_info.contactfb.replace(/(^\w+:|^)\/\//, "") : profileDetails.contact_info.contactfb;
          
          const baseColor = profileDetails.theme_element?.baseColor ? profileDetails.theme_element?.baseColor : "#1e91cf"

          res.render("view-profile", {
            backgroundColor: baseColor,
            imageFile: `/static/images/profiles/${profileDetails.profile_image}`,
            basicInfo: profileDetails.basic_info,
            vcardLink: profileDetails.vcard_id ? `${req.headers.host}/action/${profileDetails.vcard_id}` : profileDetails.vcard_id,
            contactInfo: profileDetails.contact_info,
            links: profileDetails.other_info,
            textAreas: textAreas,
          });
          break;

        default:
          res.json(defaultActionDetail);
          break;
      }
    }
  }
}

async function presentSelectedAction(req, res, next) {
  const { actionId } = req.params;
  const actionDetail = await db.getDefaultActionDetail(actionId);

  switch (actionDetail.action_name) {
    case "Whatsapp":
      res.redirect(
        `https://wa.me/${actionDetail.action_attribute.replace(/\D/g, "")}`
      );
      break;

    case "Call Phone":
      res.redirect(`tel: ${actionDetail.action_attribute}`);
      break;

    case "Send SMS":
      res.redirect(`sms: ${actionDetail.action_attribute}`);
      break;

    case "Custom URL":
      res.redirect(
        `http://${actionDetail.action_attribute.replace(
          /(^\w+:|^)\/\//,
          ""
        )}`
      );
      break;

    case "Link Tree":
      const linkTreeDetail = await db.getDefaultLinkTree(
        actionDetail.action_id
      );
      linkTreeDetail.action_attribute.map((obj) => {
        if (!isNaN(obj.link))
          obj.link = `${req.headers.host}/action/${obj.link}`;
        return obj;
      });
      res.render("link-tree", {
        links: linkTreeDetail.action_attribute,
        displayName: linkTreeDetail.display_name,
        imageFile: `/static/images/profiles/${linkTreeDetail.image_file}`,
      });
      break;

    case "vCard":
      var vCardsJS = require("vcards-js");
      const vcardDetail = await db.getDefaultVcard(actionDetail.action_id);
      const vcardAttributes = vcardDetail.vcard_attribute;

      //create a new vCard
      const vCard = vCardsJS();

      //set properties
      vCard.firstName = vcardAttributes.firstName;
      vCard.lastName = vcardAttributes.lastName;
      vCard.namePrefix = vcardAttributes.namePrefix;
      vCard.homePhone = vcardAttributes.homePhone;
      vCard.cellPhone = vcardAttributes.cellPhone;
      vCard.workPhone = vcardAttributes.workPhone;
      vCard.email = vcardAttributes.email;
      vCard.workEmail = vcardAttributes.workEmail;
      vCard.secondEmail = vcardAttributes.secondEmail;
      vCard.organization = vcardAttributes.organization;
      vCard.title = vcardAttributes.title;
      vCard.url = vcardAttributes.url;
      vCard.workUrl = vcardAttributes.workUrl;
      vCard.gender = vcardAttributes.gender;
      vCard.homeFax = vcardAttributes.homeFax;
      vCard.pagerPhone = vcardAttributes.pagerPhone;
      vCard.homeAddress.city = vcardAttributes["homeAddress.city"];
      vCard.homeAddress.countryRegion =
        vcardAttributes["homeAddress.countryRegion"];
      vCard.homeAddress.label = vcardAttributes["homeAddress.label"];
      vCard.homeAddress.postalCode = vcardAttributes["homeAddress.postalCode"];
      vCard.homeAddress.stateProvince =
        vcardAttributes["homeAddress.stateProvince"];
      vCard.homeAddress.street = vcardAttributes["homeAddress.street"];
      vCard.workAddress.city = vcardAttributes["workAddress.city"];
      vCard.workAddress.countryRegion =
        vcardAttributes["workAddress.countryRegion"];
      vCard.workAddress.label = vcardAttributes["workAddress.label"];
      vCard.workAddress.postalCode = vcardAttributes["workAddress.postalCode"];
      vCard.workAddress.stateProvince =
        vcardAttributes["workAddress.stateProvince"];
      vCard.workAddress.street = vcardAttributes["workAddress.street"];

      if(vcardDetail.profile_image)
        vCard.photo.embedFromFile(
          `public/images/profiles/${vcardDetail.profile_image}`
        );

      //set content-type and disposition including desired filename
      res.set(
        "Content-Type",
        `text/vcard; name="${vcardAttributes.firstName}-${vcardAttributes.lastName}.vcf"`
      );
      res.set(
        "Content-Disposition",
        `inline; filename="${vcardAttributes.firstName}-${vcardAttributes.lastName}.vcf"`
      );
      //send the response
      res.send(vCard.getFormattedString());

      break;

    case "Contact Profile":
      const profileDetails = await db.getDefaultProfile(
        actionDetail.action_id
      );

      //Link correction
      profileDetails.other_info.map((obj) => {
        obj.link = obj.link.replace(/(^\w+:|^)\/\//, "");

        if (obj.is_action === 1)
          obj.link = `${req.headers.host}/action/${obj.link}`;
        return obj;
      });

      //New object for textareas
      const textAreas = profileDetails.other_info.filter(
        (x) => x.is_action === 2
      );

      //fix for whatsapp
      profileDetails.contact_info.contactwhatsapp =
        profileDetails.contact_info.contactwhatsapp?.replace(/\D/g, "");
      //fix for map link
      profileDetails.contact_info.contactfb =
        profileDetails.contact_info.contactfb.replace(/(^\w+:|^)\/\//, "");

      res.render("view-profile", {
        backgroundColor: "#1e91cf",
        imageFile: `/static/images/profiles/${profileDetails.profile_image}`,
        basicInfo: profileDetails.basic_info,
        vcardLink: `${req.headers.host}/action/${profileDetails.vcard_id}`,
        contactInfo: profileDetails.contact_info,
        links: profileDetails.other_info,
        textAreas: textAreas,
      });
      break;

    default:
      res.json(actionDetail);
      break;
  }
}

module.exports = {
  presentAction,
  presentSelectedAction,
};
