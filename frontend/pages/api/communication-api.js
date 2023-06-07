import axios from 'axios';

import { beConfig } from '@/configs/backend';

export const sendMail = async (mailData) => {
  const apiResult = await axios.post(
    `${beConfig.host}/services/send-mail`,
    mailData,
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return apiResult.data;
};
