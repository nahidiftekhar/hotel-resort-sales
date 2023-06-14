import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { userId } = req.query;

  const apiResult = await axios.get(
    `${beConfig.host}/reports/pending-actions/${userId}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
