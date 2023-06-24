import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const { email, newPassword } = req.body;
  const apiResult = await axios.post(
    `${beConfig.host}/user-management/change-password`,
    {
      email,
      newPassword,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
