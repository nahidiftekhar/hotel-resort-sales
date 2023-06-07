import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const createCheckinApi = async (submitData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/create-checkin`,
    submitData,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const editCheckinApi = async (submitData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/edit-checkin`,
    submitData,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listOngoingVisitsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/list-visits`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const fetchVisitApi = async (id) => {
  if (!id) return false;

  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/view/${id}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const addPurchaseApi = async (purchases, payment) => {
  if (!purchases) return false;

  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/add-purchase`,
    { purchases },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );

  const paymentApi =
    payment.amount > 0
      ? await axios.post(
          `${beConfig.host}/payments/purchase-payment`,
          {
            payment,
          },
          {
            headers: {
              'X-CM-API-KEY': beConfig.key,
            },
          }
        )
      : { success: true };

  if (apiResult && paymentApi.success) return apiResult.data;
  else return { success: false };
};

export const addPaymentApi = async (payment) => {
  const apiResult = await axios.post(
    `${beConfig.host}/payments/purchase-payment`,
    {
      payment,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const addAdjustmentApi = async (adjustment) => {
  const payment = { ...adjustment, amount: adjustment.amount * -1 };
  const apiResult = await axios.post(
    `${beConfig.host}/payments/purchase-payment`,
    {
      payment,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const checkoutApi = async (checkoutRecord) => {
  const apiResult = await axios.post(
    `${beConfig.host}/visit-management/checkout`,
    {
      ...checkoutRecord,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const fetchVisitPurchasesApi = async (id) => {
  if (!id) return false;

  const apiResult = await axios.get(
    `${beConfig.host}/visit-management/view-purchases/${id}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};
