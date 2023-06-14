import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { dateString, duration } = req.query;

  const apiResult = await axios.get(
    `${beConfig.host}/reports/daywise-bookings/${dateString}/${duration}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
