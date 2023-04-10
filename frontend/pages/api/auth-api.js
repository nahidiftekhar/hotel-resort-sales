import axios from "axios";
import { beConfig } from "@/configs/backend";
import logoutApi from "./logoutApi"

export default async function authorizeAccess(accessType) {
  const token = localStorage.getItem("CMRT");
  const result = await axios.post(
    `${beConfig.host}user-management/authorize`,
    {
      accessType,
      token
    }, 
    {
      withCredentials: true
    }
  )

    // if(result.data.forceLogout && typeof window !== 'undefined') window.location.href = "/logout";
  if(result.data.forceLogout && typeof window !== 'undefined') await logoutApi();
  else return result.data
}
