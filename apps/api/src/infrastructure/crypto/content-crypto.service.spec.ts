import { describe, expect, it } from "vitest";
import { ContentCryptoService } from "./content-crypto.service";

describe("ContentCryptoService", () => {
  it("encrypts with a random IV and decrypts without data loss", () => {
    const key = Buffer.alloc(32, 7).toString("base64");
    const service = new ContentCryptoService({ get: () => key } as never);
    const first = service.encrypt("My private learning goal");
    const second = service.encrypt("My private learning goal");
    expect(Buffer.from(first).equals(Buffer.from(second))).toBe(false);
    expect(service.decrypt(first)).toBe("My private learning goal");
  });

  it("fails closed when no valid encryption key is configured", () => {
    const service = new ContentCryptoService({ get: () => undefined } as never);
    expect(() => service.encrypt("secret")).toThrow(/DATA_ENCRYPTION_KEY/);
  });
});
