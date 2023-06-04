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
    `${beConfig.host}/product-management/room-categories`
    // `${beConfig.host}/product-management/fetch-rooms`
  );
  return apiResult.data;
};

export const listAllServicesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-services`
  );
  return apiResult.data;
};

export const listPrixfixeTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/prixfixe-categories`
  );
  return apiResult.data;
};

export const listAlacarteTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/alacarte-categories`
  );
  return apiResult.data;
};

export const listPackageTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/package-categories`
  );
  return apiResult.data;
};

export const listRoomTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/room-categories`
  );
  return apiResult.data;
};

export const listServiceTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/service-categories`
  );
  return apiResult.data;
};

export const addNewPackageApi = async (
  packageDetails,
  description,
  imageUrl
) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/add-package`,
    { ...packageDetails, description, imageUrl }
  );
  return apiResult.data;
};

export const editPackageApi = async (packageDetails, description, imageUrl) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/edit-package`,
    { ...packageDetails, description, imageUrl }
  );
  return apiResult.data;
};

export const editPrixfixeApi = async (
  packageDetails,
  description,
  imageUrl
) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/edit-prixfixe`,
    { ...packageDetails, description, imageUrl }
  );
  return apiResult.data;
};

export const editAlacarteApi = async (
  packageDetails,
  description,
  imageUrl
) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/edit-alacarte`,
    { ...packageDetails, description, imageUrl }
  );
  return apiResult.data;
};

export const editRoomApi = async (
  productDetails,
  description,
  imageUrl,
  isNew
) => {
  const apiResult = isNew
    ? await axios.post(`${beConfig.host}/product-management/add-room`, {
        ...productDetails,
        description,
        imageUrl,
      })
    : await axios.post(`${beConfig.host}/product-management/edit-room`, {
        ...productDetails,
        description,
        imageUrl,
      });
  return apiResult.data;
};

export const editServiceApi = async (
  packageDetails,
  description,
  imageUrl,
  isNew
) => {
  const apiResult = isNew
    ? await axios.post(`${beConfig.host}/product-management/add-service`, {
        ...packageDetails,
        description,
        imageUrl,
      })
    : await axios.post(`${beConfig.host}/product-management/edit-service`, {
        ...packageDetails,
        description,
        imageUrl,
      });
  return apiResult.data;
};

export const deactivatePackageApi = async (packageId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-package`,
    { packageId }
  );
  return apiResult.data;
};

export const deactivatePrixfixeApi = async (prixfixeId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-prixfixe`,
    { prixfixeId }
  );
  return apiResult.data;
};

export const deactivateAlacarteApi = async (alacarteId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-alacarte`,
    { alacarteId }
  );
  return apiResult.data;
};

export const deactivateRoomApi = async (roomId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-room`,
    { roomId }
  );
  return apiResult.data;
};

export const deactivateServiceApi = async (serviceId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-service`,
    { serviceId }
  );
  return apiResult.data;
};
