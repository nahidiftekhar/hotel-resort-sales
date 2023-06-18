import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { roomId } = req.query;

  const apiResult = await axios.get(
    `${beConfig.host}/rooms/room-data/${roomId}`,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
