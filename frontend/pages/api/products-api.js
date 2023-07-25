import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const listAllPackagesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-packages`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listAllPrixfixeApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-prixfixe`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listAllAlacarteApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-alacarte`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listAllRoomsApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/room-list`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listAllServicesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/fetch-services`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listPrixfixeTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/prixfixe-categories`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listAlacarteTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/alacarte-categories`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listPackageTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/package-categories`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listRoomTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/room-categories`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const listServiceTypesApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/product-management/service-categories`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
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
    { ...packageDetails, description, imageUrl },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const editPackageApi = async (packageDetails, description, imageUrl) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/edit-package`,
    { ...packageDetails, description, imageUrl },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
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
    { ...packageDetails, description, imageUrl },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
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
    { ...packageDetails, description, imageUrl },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
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
    ? await axios.post(
        `${beConfig.host}/product-management/add-room`,
        {
          ...productDetails,
          description,
          imageUrl,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      )
    : await axios.post(
        `${beConfig.host}/product-management/edit-room`,
        {
          ...productDetails,
          description,
          imageUrl,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      );
  return apiResult.data;
};

export const editRoomTypeApi = async (
  productDetails,
  description,
  isNew
) => {
  const apiResult = isNew
    ? await axios.post(
        `${beConfig.host}/product-management/add-room-type`,
        {
          ...productDetails,
          description,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      )
    : await axios.post(
        `${beConfig.host}/product-management/edit-room-type`,
        {
          ...productDetails,
          description,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      );
  return apiResult.data;
};

export const editServiceApi = async (
  packageDetails,
  description,
  imageUrl,
  isNew
) => {
  const apiResult = isNew
    ? await axios.post(
        `${beConfig.host}/product-management/add-service`,
        {
          ...packageDetails,
          description,
          imageUrl,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      )
    : await axios.post(
        `${beConfig.host}/product-management/edit-service`,
        {
          ...packageDetails,
          description,
          imageUrl,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      );
  return apiResult.data;
};

export const deactivatePackageApi = async (packageId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-package`,
    { packageId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const deactivatePrixfixeApi = async (prixfixeId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-prixfixe`,
    { prixfixeId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const deactivateAlacarteApi = async (alacarteId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-alacarte`,
    { alacarteId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const deactivateRoomApi = async (roomId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-room`,
    { roomId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const deactivateRoomTypeApi = async (roomTypeId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-room-type`,
    { roomTypeId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};

export const deactivateServiceApi = async (serviceId) => {
  const apiResult = await axios.post(
    `${beConfig.host}/product-management/deactivate-service`,
    { serviceId },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};
