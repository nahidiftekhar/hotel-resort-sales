import axios from "axios";
import { beConfig } from "@/configs/backend";

export async function getActionApi(cardId, actionType) {
  const result = await axios.post(
    `${beConfig.host}action-management/get-single-action`,
    {
      cardId,
      actionTypeId: actionType,
    }
  );
  return result.data;
}

export async function getActionByIdApi(actionId) {
  const result = await axios.post(
    `${beConfig.host}action-management/get-action-by-id`,
    {
      actionId
    }
  );
  return result.data;
}

export async function deleteActionByIdApi(actionId) {
  const result = await axios.post(
    `${beConfig.host}action-management/delete-action`,
    {
      actionId
    }
  );
  return result.data;
}

export async function getDefaultActionApi(actionId) {
  const result = await axios.post(
    `${beConfig.host}action-management/get-default-action`,
    {
      actionId
    }
  );
  return result.data;
}

export async function getDefaultActionDetailApi(cardId) {
  const result = await axios.post(
    `${beConfig.host}action-management/get-default-action-detail`,
    {
      cardId
    }
  );
  return result.data;
}

export async function addActionApi(cardId, actionType, actionAttribute, actionName) {
  const result = await axios.post(
    `${beConfig.host}action-management/add-action`,
    {
      cardId,
      actionType,
      actionAttribute,
      actionName
    }
  );
  return result.data;
}

export async function modActionApi(
  actionId,
  cardId,
  actionType,
  actionAttribute,
  actionName
) {
  const result = await axios.post(
    `${beConfig.host}action-management/edit-action`,
    {
      actionId,
      cardId,
      actionType,
      actionAttribute,
      actionName
    }
  );
  return result.data;
}

export async function defaultActionApi(cardId, actionId) {
  const result = await axios.post(
    `${beConfig.host}action-management/default-action`,
    {
      cardId,
      actionId,
    }
  );
  return result.data;
}

export async function getActionListApi() {
  const result = await axios.get(
    `${beConfig.host}action-management/get-action-list`,
  );
  return result.data;
}

export async function getActionTypeApi(actionId) {
  const result = await axios.post(
    `${beConfig.host}action-management/get-action-type`,
    { actionId }
  );
  return result.data;
}

export async function activateCardApi(cardData) {
  const {cardLink, activationCode, userId} =  cardData
  const result = await axios.post(
    `${beConfig.host}card-management/activate-card`,
    { cardLink, activationCode, userId }
  );
  return result.data;
}
