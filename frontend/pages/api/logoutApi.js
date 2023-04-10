import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function logoutApi() {
  const result = await axios.get(
    `${beConfig.host}user-management/logout`,
    {withCredentials: true}
  );
  if(result.data.logoutStatus && typeof window !== 'undefined') localStorage.removeItem("CMRT");
  // return result.data;
  if(result.data.logoutStatus && typeof window !== 'undefined') window.location.href = "/login";
  return false;
}
