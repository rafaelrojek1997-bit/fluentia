import { Module } from "@nestjs/common";
import { AI_PROVIDER } from "./mentor.types";
import { OpenAiAdapter } from "./openai.adapter";

@Module({
  providers: [OpenAiAdapter, { provide: AI_PROVIDER, useExisting: OpenAiAdapter }],
  exports: [AI_PROVIDER]
})
export class AiModule {}
