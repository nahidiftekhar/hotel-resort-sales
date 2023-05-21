import CryptoJS from 'crypto-js';
import { storageConfig } from '@/configs/config';

export function writeToStorage(value, key) {
  const encodedValue = CryptoJS.AES.encrypt(
    value,
    storageConfig.ENCRYPTION_SECRET
  ).toString();

  try {
    localStorage.setItem(storageConfig[key], encodedValue);
    return true;
  } catch (error) {
    console.log('Error while setting localstorage: ' + error);
    return false;
  }
}

export function readFromStorage(key) {
  const encodedValue = localStorage.getItem(storageConfig[key]);

  if (!encodedValue) return -1;

  const decodedValue = CryptoJS.AES.decrypt(
    encodedValue,
    storageConfig.ENCRYPTION_SECRET
  ).toString(CryptoJS.enc.Utf8);

  return Number(decodedValue);
}
