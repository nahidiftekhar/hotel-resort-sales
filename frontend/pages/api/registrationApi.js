import axios from "axios";
import { beConfig } from "@/configs/backend";

export async function registrationApi(email, userName, passPlain, type) {
  const result = await axios.post(
    `${beConfig.host}user-management/signup`,
    {
      email,
      userName,
      passPlain,
      type,
    }, 
  );
  return result;
}


export async function resendValidationApi(email) {
  const result = await axios.get(
    `${beConfig.host}user-management/resend-validation/${email}`
  );
  return result;
}
