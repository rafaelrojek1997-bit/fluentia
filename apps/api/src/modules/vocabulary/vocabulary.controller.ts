import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticatedUser, CurrentUser } from "../../common/current-user.decorator";
import { CreateVocabularyEntryDto } from "./vocabulary.dto";
import { VocabularyService } from "./vocabulary.service";

@ApiTags("Vocabulary")
@Controller("vocabulary")
export class VocabularyController {
  constructor(private readonly vocabulary: VocabularyService) {}
  @Get() list(@CurrentUser() user: AuthenticatedUser, @Headers("x-learning-language") language = "en") { return this.vocabulary.list(user.id, language === "de" ? "de" : "en"); }
  @Post() create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateVocabularyEntryDto) { return this.vocabulary.create(user.id, dto); }
  @Delete(":id") remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.vocabulary.remove(user.id, id); }
}
