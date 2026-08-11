import { Injectable, NotFoundException } from "@nestjs/common";
import { ContentCryptoService } from "../../infrastructure/crypto/content-crypto.service";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { CreateVocabularyEntryDto } from "./vocabulary.dto";

@Injectable()
export class VocabularyService {
  constructor(private readonly db: PrismaService, private readonly crypto: ContentCryptoService) {}

  async list(userId: string, language: "en" | "de") {
    const rows = await this.db.vocabularyEntry.findMany({
      where: { userId, language, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 300
    });
    return rows.flatMap(row => {
      try {
        return [{
          id: row.id, language: row.language,
          term: this.crypto.decrypt(row.termEncrypted),
          translation: this.crypto.decrypt(row.translationEncrypted),
          example: row.exampleEncrypted ? this.crypto.decrypt(row.exampleEncrypted) : undefined,
          notes: row.notesEncrypted ? this.crypto.decrypt(row.notesEncrypted) : undefined,
          sourceType: row.sourceType, createdAt: row.createdAt
        }];
      } catch { return []; }
    });
  }

  async create(userId: string, dto: CreateVocabularyEntryDto) {
    const row = await this.db.vocabularyEntry.create({ data: {
      userId, language: dto.language,
      termEncrypted: this.crypto.encrypt(dto.term.trim()),
      translationEncrypted: this.crypto.encrypt(dto.translation.trim()),
      exampleEncrypted: dto.example?.trim() ? this.crypto.encrypt(dto.example.trim()) : undefined,
      notesEncrypted: dto.notes?.trim() ? this.crypto.encrypt(dto.notes.trim()) : undefined,
      sourceType: dto.sourceType ?? "MANUAL"
    } });
    return { id: row.id, language: row.language, term: dto.term.trim(), translation: dto.translation.trim(), example: dto.example?.trim() || undefined, notes: dto.notes?.trim() || undefined, sourceType: row.sourceType, createdAt: row.createdAt };
  }

  async remove(userId: string, id: string) {
    const entry = await this.db.vocabularyEntry.findFirst({ where: { id, userId, deletedAt: null } });
    if (!entry) throw new NotFoundException({ code: "VOCABULARY_ENTRY_NOT_FOUND" });
    await this.db.vocabularyEntry.update({ where: { id }, data: { deletedAt: new Date(), version: { increment: 1 } } });
    return { deleted: true };
  }
}
