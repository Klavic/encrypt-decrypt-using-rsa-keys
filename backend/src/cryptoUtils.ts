import * as crypto from "crypto";

export class CryptoUtils {
  public static async importPrivateKey(
    pPrivateKeyEncoded: string
  ): Promise<crypto.webcrypto.CryptoKey> {
    const keyBuffer = Buffer.from(pPrivateKeyEncoded, "base64");

    return crypto.webcrypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
  }

  public static async decryptText(
    pPrivateKey: crypto.webcrypto.CryptoKey,
    pEncryptedText: string
  ): Promise<string> {
    const bufferOrigem = Buffer.from(pEncryptedText, "base64");
    const decriptedText = await crypto.webcrypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      pPrivateKey,
      bufferOrigem
    );

    return String.fromCharCode.apply(
      null,
      new Uint8Array(decriptedText) as any
    );
  }
}
