import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { startDatestring, endDatestring } = req.body;
  const apiResult = await axios.get(
    `${beConfig.host}/purchase/daywise/${startDatestring}/${endDatestring}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
