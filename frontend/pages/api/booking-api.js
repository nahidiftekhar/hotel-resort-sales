import axios from 'axios';
import { beConfig } from '@/configs/backend';

export const listAllBookingApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/list-all-booking`
  );
  return apiResult.data;
};

export const createBookingApi = async (visitData, productData) => {
  const {
    packageDetails,
    prixfixeDetails,
    alacarteDetails,
    roomDetails,
    serviceDetails,
  } = productData;

  const objectToSubmit = {
    guestId: productData.guestId,
    userId: productData.userId,
    checkInDate: visitData.checkInDate,
    checkOutDate: visitData.checkOutDate,
    adultCount: 0,
    kidsCount: 0,
    amount:
      (productData.totalPackageCost || 0) +
      (productData.totalPrixfixeCost || 0) +
      (productData.totalRoomCost || 0) +
      (productData.totalAlacarteCost || 0) +
      (productData.totalServiceCost || 0),
    currency: visitData.values,
    components: {
      packageDetails,
      prixfixeDetails,
      alacarteDetails,
      roomDetails,
      serviceDetails,
    },
    notes: visitData.notes,
  };

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/create-booking`,
    objectToSubmit
  );

  return apiResult.data;
};

export const getMaxDiscountSlab = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/max-discount`
  );
  return apiResult.data;
};

export const createDiscountApi = async (discountData) => {
  const objectToSubmit = {
    percentageValue: discountData.discountPercentage,
    totalValue: discountData.priceBeforeDiscount,
    notes: discountData.notes,
    bookingId: discountData.bookingId,
    requesterId: discountData.userId,
    approverId: 1,
  };
  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/create-discount`,
    objectToSubmit
  );
  return apiResult.data;
};

export const approveDiscountApi = async (discountData) => {
  const objectToSubmit = {
    discountId: discountData.id,
    bookingId: discountData.booking_id,
    approvedPercentage: discountData.percentage_value,
    notes:
      (discountData.discount_notes || '') +
      '\nApproverNotes: ' +
      discountData.notes,
    approverId: discountData.approver_id,
    approvalStatus: discountData.approvalStatus,
    discountedAmount: discountData.discountedAmount,
  };

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/approve-discount`,
    objectToSubmit
  );
  return apiResult.data;
};
