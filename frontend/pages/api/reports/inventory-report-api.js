import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { startDate, endDate } = req.body;
  const apiResult = await axios.post(
    `${beConfig.host}/reports/stock-report`,
    {
      startDate,
      endDate,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
