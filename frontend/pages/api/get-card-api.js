import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function getCardDetails(cardLink) {
  const result = await axios.get(`${beConfig.host}card-management/${cardLink}`)
  return result.data
}
