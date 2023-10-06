import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { dateString, duration } = req.body;

  const apiResult = await axios.get(
    `${beConfig.host}/reports/expenseDaily/${dateString}/${duration}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
