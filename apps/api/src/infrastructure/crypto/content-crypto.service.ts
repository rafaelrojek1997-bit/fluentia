import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

@Injectable()
export class ContentCryptoService {
  constructor(private readonly config: ConfigService) {}

  encrypt(value: string): Uint8Array<ArrayBuffer> {
    const key = this.key();
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return Uint8Array.from(Buffer.concat([iv, cipher.getAuthTag(), ciphertext]));
  }

  decrypt(payload: Uint8Array): string {
    const key = this.key();
    const value = Buffer.from(payload);
    if (value.length < 29) throw new Error("Encrypted content is malformed");
    const decipher = createDecipheriv("aes-256-gcm", key, value.subarray(0, 12));
    decipher.setAuthTag(value.subarray(12, 28));
    return Buffer.concat([decipher.update(value.subarray(28)), decipher.final()]).toString("utf8");
  }

  private key(): Buffer {
    const encoded = this.config.get<string>("DATA_ENCRYPTION_KEY");
    const key = encoded ? Buffer.from(encoded, "base64") : Buffer.alloc(0);
    if (key.length !== 32) {
      throw new ServiceUnavailableException({
        code: "ENCRYPTION_NOT_CONFIGURED",
        message: "DATA_ENCRYPTION_KEY must be a base64-encoded 32-byte key."
      });
    }
    return key;
  }
}
