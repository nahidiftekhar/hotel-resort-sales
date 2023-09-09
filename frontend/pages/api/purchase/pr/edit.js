import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { id, status, notes, userId, usertypeId, cost } = req.body;
  const apiResult = await axios.put(
    `${beConfig.host}/purchase/pr`,
    {
      id,
      status,
      notes,
      userId,
      usertypeId,
      cost,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
