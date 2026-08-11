import { Global, Module } from "@nestjs/common";
import { ContentCryptoService } from "./content-crypto.service";

@Global()
@Module({ providers: [ContentCryptoService], exports: [ContentCryptoService] })
export class CryptoModule {}
