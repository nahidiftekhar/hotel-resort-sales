import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { productId, quantity, notes, userId, price } = req.body;
  const apiResult = await axios.post(
    `${beConfig.host}/purchase/pr`,
    {
      productId: Number(productId),
      quantity: Number(quantity),
      price: Number(price),
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
