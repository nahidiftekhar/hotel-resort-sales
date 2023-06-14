import axios from 'axios';
import { beConfig } from '@/configs/backend';

export default async function handler(req, res) {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    status,
    userId,
    bookingId,
    visitId,
    guestId,
  } = req.body;

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/room-booking`,
    {
      roomId,
      checkInDate,
      checkOutDate,
      status,
      userId,
      bookingId,
      visitId,
      guestId,
    },
    {
      headers: {
        'X-CM-API-KEY': beConfig.key,
      },
    }
  );
  return res.json(apiResult.data);
}
