import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function passwordResetApi(email_id) {
  const result = await axios.post(
    `${beConfig.host}user-management/forgot-password`,
    {
      email_id
    }, 
    {withCredentials: true}
  );
  if(result.data.successStatus) localStorage.setItem("CMRT", result.data.CMRT)
  return result;
}
