import axios from "axios";
import { beConfig } from "@/configs/backend";

export default async function editSingleCard(card_id, cardTag, cardLink, isActive) {
  const result = await axios.post(
    `${beConfig.host}card-management/edit-single-card`,
    {
      cardId: card_id,
      cardTag, cardLink, isActive
    }
  )
  return result.data
}
