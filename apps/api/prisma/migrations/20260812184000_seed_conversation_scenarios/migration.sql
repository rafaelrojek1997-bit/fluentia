-- Active scenarios required by both English and German conversations.
INSERT INTO "scenarios" ("id","slug","version","status","title","description","supported_levels","supported_modes","learning_objectives","success_rubric","configuration","published_at","updated_at")
SELECT
  ('10000000-0000-4000-8000-' || lpad(row_number() OVER ()::text,12,'0'))::uuid,
  source.slug, 1, 'ACTIVE'::"ScenarioStatus", source.title::jsonb, source.description::jsonb,
  ARRAY['A1','A2','B1','B2','C1','C2']::"CefrLevel"[],
  ARRAY['TEXT','VOICE','MIXED']::"SessionMode"[],
  '["communicative-confidence","practical-vocabulary","natural-responses"]'::jsonb,
  '{"turnCompletion":0.4,"clarity":0.3,"taskFulfilment":0.3}'::jsonb,
  '{"maximumTurns":24,"language":"multilingual","safetyProfile":"standard-adult-v1"}'::jsonb,
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (VALUES
 ('airport','{"en":"At the airport","de":"Am Flughafen"}','{"en":"Check in, pass security and solve travel problems.","de":"Einchecken, die Sicherheitskontrolle passieren und Reiseprobleme l?sen."}'),
 ('hotel','{"en":"At the hotel","de":"Im Hotel"}','{"en":"Check in, ask about services and handle room issues.","de":"Einchecken, nach Leistungen fragen und Probleme mit dem Zimmer kl?ren."}'),
 ('job-interview','{"en":"Job interview","de":"Vorstellungsgespr?ch"}','{"en":"Describe your experience, strengths and motivation.","de":"?ber Erfahrung, St?rken und Motivation sprechen."}'),
 ('restaurant','{"en":"At a restaurant","de":"Im Restaurant"}','{"en":"Order naturally, ask questions and resolve mistakes.","de":"Nat?rlich bestellen, Fragen stellen und Fehler freundlich kl?ren."}'),
 ('business','{"en":"Business meeting","de":"Gesch?ftsbesprechung"}','{"en":"Share opinions, clarify details and agree next steps.","de":"Meinungen ?u?ern, Details kl?ren und n?chste Schritte vereinbaren."}'),
 ('date','{"en":"Meeting someone","de":"Jemanden kennenlernen"}','{"en":"Have a respectful, relaxed conversation and show interest.","de":"Ein respektvolles, entspanntes Gespr?ch f?hren und Interesse zeigen."}'),
 ('doctor','{"en":"At the doctor","de":"Beim Arzt"}','{"en":"Describe symptoms and understand practical advice.","de":"Symptome beschreiben und praktische Empfehlungen verstehen."}'),
 ('phone-call','{"en":"Phone call","de":"Telefongespr?ch"}','{"en":"Open, manage and close a clear telephone conversation.","de":"Ein klares Telefongespr?ch beginnen, f?hren und beenden."}'),
 ('small-talk','{"en":"Small talk","de":"Smalltalk"}','{"en":"Start and sustain friendly everyday conversation.","de":"Ein freundliches Alltagsgespr?ch beginnen und aufrechterhalten."}'),
 ('presentation','{"en":"Presentation","de":"Pr?sentation"}','{"en":"Introduce, structure and conclude a short presentation.","de":"Eine kurze Pr?sentation einleiten, strukturieren und abschlie?en."}'),
 ('travel','{"en":"Travel problem","de":"Problem auf Reisen"}','{"en":"Ask for help and adapt when plans unexpectedly change.","de":"Um Hilfe bitten und reagieren, wenn sich Pl?ne unerwartet ?ndern."}')
) AS source(slug,title,description)
ON CONFLICT ("slug","version") DO UPDATE SET
 "status"='ACTIVE', "title"=EXCLUDED."title", "description"=EXCLUDED."description",
 "supported_levels"=EXCLUDED."supported_levels", "supported_modes"=EXCLUDED."supported_modes",
 "learning_objectives"=EXCLUDED."learning_objectives", "success_rubric"=EXCLUDED."success_rubric",
 "configuration"=EXCLUDED."configuration", "published_at"=EXCLUDED."published_at", "updated_at"=CURRENT_TIMESTAMP;
