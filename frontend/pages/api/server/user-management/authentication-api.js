import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const loginApi = async (email, passPlain) => {
  const res = await axios.post(
    `${beConfig.host}/user-management/login`,
    {
      email,
      passPlain,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.data;
};
