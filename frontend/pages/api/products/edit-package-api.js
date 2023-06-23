import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { productData, description, imageUrl, isNew } = req.body;
  const apiResult = isNew
    ? await axios.post(
        `${beConfig.host}/product-management/add-package`,
        {
          ...productData,
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
        `${beConfig.host}/product-management/edit-package`,
        {
          ...productData,
          description,
          imageUrl,
        },
        {
          headers: {
            'X-CM-API-KEY': beConfig.key,
          },
        }
      );
  return res.json(apiResult.data);
}
