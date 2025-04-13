export interface Secret {
  id: string;
  encryptedMessage: string;
  createdAt: string;
  expiresAt: string;
  remainingViews: number;
}

export interface SecretFormData {
  message: string;
  expiresIn: number;
  maxViews: number;
}

export interface DecryptedSecret {
  message: string;
  metadata: {
    createdAt: string;
    expiresAt: string;
    remainingViews: number;
  };
}
