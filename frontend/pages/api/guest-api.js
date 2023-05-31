import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const listAllGuestsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/guest-management/list-all`
  );
  return apiResult.data;
};

export const addSingleGuestApi = async (
  guestData,
  profileImage,
  idFront,
  idBack
) => {
  const apiResult = await axios.post(
    `${beConfig.host}/guest-management/add-guest`,
    { ...guestData, profileImage, idFront, idBack }
  );
  return apiResult.data;
};

export const editSingleGuestApi = async (guestData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/guest-management/edit-guest`,
    guestData
  );
  return apiResult.data;
};

export const fetchGuestApi = async (guestId) => {
  const apiResult = await axios.get(
    `${beConfig.host}/guest-management/fetch-guest/${guestId}`
  );
  return apiResult.data;
};
