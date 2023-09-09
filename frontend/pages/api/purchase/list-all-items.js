import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const apiResult = await axios.get(`${beConfig.host}/purchase/product`, {
    headers: {
      'X-CM-API-KEY': beConfig.key,
    },
  });
  return res.json(apiResult.data);
}
