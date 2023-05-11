import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const listAllPackagesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-packages`
  );
  return apiResult.data;
};

export const listAllPrixfixeApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-prixfixe`
  );
  return apiResult.data;
};

export const listAllAlacarteApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-alacarte`
  );
  return apiResult.data;
};

export const listAllRoomsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-rooms`
  );
  return apiResult.data;
};

export const listAllServicesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-services`
  );
  return apiResult.data;
};
