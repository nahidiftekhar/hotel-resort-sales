import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function loginApi(email, passPlain, type) {
  const result = await axios.post(
    `${beConfig.host}user-management/login`,
    {
      email,
      passPlain,
      type,
    }, 
    {withCredentials: true}
  );
  if(result.data.successStatus) {
    localStorage.setItem("CMRT", result.data.CMRT);
    localStorage.setItem("CMUT", result.data.type);
  }
  return {
    successStatus: result.data.successStatus,
    userType: result.data.type,
    reason: result.data.reason
  }
}
