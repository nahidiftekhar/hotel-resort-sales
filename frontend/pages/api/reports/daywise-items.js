import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { dateString } = req.body;
  const apiResult = await axios.get(
    `${beConfig.host}/purchase/daywise/${dateString}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
