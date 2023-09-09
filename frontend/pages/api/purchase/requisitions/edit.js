import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { id, status, quantity, notes, approverId, usertypeId } = req.body;
  const apiResult = await axios.put(
    `${beConfig.host}/purchase/requisition`,
    {
      id,
      status,
      quantity,
      notes,
      approverId,
      usertypeId,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
