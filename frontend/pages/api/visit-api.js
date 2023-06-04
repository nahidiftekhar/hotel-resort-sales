import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const createCheckinApi = async (submitData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/create-checkin`,
    submitData
  );
  return apiResult.data;
};

export const editCheckinApi = async (submitData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/edit-checkin`,
    submitData
  );
  return apiResult.data;
};

export const listOngoingVisitsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/list-visits`
  );
  return apiResult.data;
};

export const fetchVisitApi = async (id) => {
  if (!id) return false;

  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/view/${id}`
  );
  return apiResult.data;
};

export const addPurchaseApi = async (purchases, payment) => {
  if (!purchases) return false;

  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/add-purchase`,
    { purchases }
  );

  const paymentApi =
    payment.amount > 0
      ? await axios.post(`${beConfig.host}/payments/purchase-payment`, {
          payment,
        })
      : { success: true };

  if (apiResult && paymentApi.success) return apiResult.data;
  else return { success: false };
};

export const fetchVisitPurchasesApi = async (id) => {
  if (!id) return false;

  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/view-purchases/${id}`
  );
  return apiResult.data;
};
