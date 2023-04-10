import axios from "axios";
import { beConfig } from "@/configs/backend";

export async function generateLinkApi() {
  const result = await axios.get(
    `${beConfig.host}card-management/create-card-link`
  );
  return result.data;
}

export async function createCardApi(cardData) {
  const { cardLink, groupId, orderEmail, qrCode, orderReference } = cardData;
  const result = await axios.post(`${beConfig.host}card-management/add-card`, {
    cardLink,
    groupId,
    orderEmail,
    qrCode,
    orderReference,
  });
  return result.data;
}

export async function cardStatApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}card-management/get-card-stat`,
    {
      cardId,
    }
  );
  return result.data;
}

export async function dailyStatApi(cardId, startDate, endDate) {
  const result = await axios.post(
    `${beConfig.host}card-management/get-daily-stat`,
    {
      cardId,
      startDate,
      endDate
    }
  );
  return result.data;
}

export async function actionStatApi(cardId, startDate, endDate) {
  const result = await axios.post(
    `${beConfig.host}card-management/get-action-stat`,
    {
      cardId,
      startDate,
      endDate
    }
  );
  return result.data;
}

export async function listAllCardApi() {
  const result = await axios.get(
    `${beConfig.host}card-management/list-all-cards`
  );
  return result.data;
}

export async function getCardDetailsApi(cardLink) {
  const result = await axios.get(`${beConfig.host}card-management/${cardLink}`);
  return result.data;
}

export async function getCardInfoByCardLinkApi(cardLink) {
  const result = await axios.get(
    `${beConfig.host}card-management/getCardInfoByCardLink/${cardLink}`
  );
  return result.data;
}

export async function blockCardByIdApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}card-management/block-card`,
    { cardId }
  );
  return result.data;
}

export async function unblockCardByIdApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}card-management/unblock-card`,
    { cardId }
  );
  return result.data;
}

export async function proCardByIdApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}card-management/pro-card`,
    { cardId }
  );
  return result.data;
}

export async function unproCardByIdApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}card-management/unpro-card`,
    { cardId }
  );
  return result.data;
}

export async function resendActivationApi(cardLink) {
  console.log('cardLink: ' + cardLink);
  const result = await axios.get(
    `${beConfig.host}card-management/resendActivationCode/${cardLink}`
  );
  return result.data;
}
