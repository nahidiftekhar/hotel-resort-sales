import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { name, unit, productSubCategory } = req.body;
  const apiResult = await axios.post(
    `${beConfig.host}/purchase/product`,
    {
      name,
      unit,
      subcategoryId: productSubCategory,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
