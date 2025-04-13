import CryptoJS from "crypto-js";

export const generateKey = (length: number = 32): string => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return key;
};

export const encryptSecret = (text: string, key: string): string => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptSecret = (encryptedText: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
