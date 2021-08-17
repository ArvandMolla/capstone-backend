import language from "@google-cloud/language";
("use strict");

async function analyzeEntitiesOfText(text) {
  const client = new language.LanguageServiceClient();

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  const [result] = await client.analyzeEntities({ document });

  const entities = result.entities;

  return entities;
}

export default analyzeEntitiesOfText;
