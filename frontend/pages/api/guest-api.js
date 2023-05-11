import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const listAllGuestsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/guest-management/list-all`
  );
  return apiResult.data;
};

export const addSingleGuestApi = async (guestData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/guest-management/add-guest`,
    guestData
  );
  return apiResult.data;
};

export const editSingleGuestApi = async (guestData) => {
  console.log('guestData: ' + JSON.stringify(guestData));
  const apiResult = await axios.post(
    `${beConfig.host}/guest-management/edit-guest`,
    guestData
  );
  return apiResult.data;
};
