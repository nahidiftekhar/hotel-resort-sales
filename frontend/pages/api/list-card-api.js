import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function listCardApi(userId) {
  const result = await axios.post(
    `${beConfig.host}card-management/list-cards`,
    {
      userId,
    }, 
  )
  return result.data
}
