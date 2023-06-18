import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { dateString } = req.query;

  const apiResult = await axios.get(`${beConfig.host}/rooms/${dateString}`, {
    headers: {
      'X-CM-API-KEY': beConfig.key,
    },
  });
  return res.json(apiResult.data);
}
