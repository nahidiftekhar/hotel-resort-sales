import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const loginApi = async (email, passPlain) => {
  const res = await axios.post(`${beConfig.host}/user-management/login`, {
    email,
    passPlain,
  });
  return res.data;
};
