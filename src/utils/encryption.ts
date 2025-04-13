import CryptoJS from "crypto-js";

export const decryptMessage = async (
  encryptedMessage: string
): Promise<string> => {
  try {
    const key = window.location.hash.slice(1); // Get the key from URL hash
    if (!key) {
      throw new Error("Decryption key not found");
    }

    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Failed to decrypt message");
    }

    return decrypted;
  } catch (error) {
    throw new Error("Failed to decrypt message");
  }
};
