import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { email, password, name, phone, userType } = req.body;

  const apiResult = await axios.post(
    `${beConfig.host}/user-management/create-user`,
    { email, password, name, phone, userType },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
