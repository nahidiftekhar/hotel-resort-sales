import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { productId, quantity, notes, userId } = req.body;
  const apiResult = await axios.post(
    `${beConfig.host}/purchase/requisition`,
    {
      productId,
      quantity,
      notes,
      userId,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
