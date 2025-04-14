import { encryptSecret, decryptSecret, generateKey } from "./crypto";

const API_URL = "https://shhh-secret.onrender.com/api";

export const createSecret = async (
  text: string,
  expiration: string
): Promise<string> => {
  const key = generateKey();
  const encryptedContent = encryptSecret(text, key);

  const response = await fetch(`${API_URL}/secrets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      encryptedContent,
      expiration,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create secret");
  }

  const { id } = await response.json();
  return `${window.location.origin}/shhh/${id}#${key}`;
};

export const getSecret = async (id: string, key: string): Promise<string> => {
  const response = await fetch(`${API_URL}/secrets/${id}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve secret");
  }

  const { encryptedContent } = await response.json();
  return decryptSecret(encryptedContent, key);
};
