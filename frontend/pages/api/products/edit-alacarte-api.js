import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { productData, description, imageUrl, isNew } = req.body;

  const apiResult = isNew
    ? await axios.post(
        `${beConfig.host}/product-management/add-alacarte`,
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
        `${beConfig.host}/product-management/edit-alacarte`,
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
