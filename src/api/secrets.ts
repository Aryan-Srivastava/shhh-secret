import { Secret, SecretFormData, DecryptedSecret } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getSecret(id: string): Promise<Secret> {
  const response = await fetch(`${API_BASE_URL}/api/secrets/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch secret");
  }

  return response.json();
}

export async function createSecret(data: SecretFormData): Promise<Secret> {
  const response = await fetch(`${API_BASE_URL}/api/secrets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create secret");
  }

  return response.json();
}

export async function decryptSecret(id: string): Promise<DecryptedSecret> {
  const response = await fetch(`${API_BASE_URL}/api/secrets/${id}/decrypt`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to decrypt secret");
  }

  return response.json();
}
