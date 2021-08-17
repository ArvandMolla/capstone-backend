"use strict";
import videoIntelligence from "@google-cloud/video-intelligence";

async function analyzeVideoTranscription(gcsUri) {
  const client = new videoIntelligence.VideoIntelligenceServiceClient();

  const videoContext = {
    speechTranscriptionConfig: {
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
    },
  };

  const request = {
    inputUri: gcsUri,
    features: ["SPEECH_TRANSCRIPTION"],
    videoContext: videoContext,
  };

  const [operation] = await client.annotateVideo(request);
  console.log("Waiting for operation to complete...");
  const [operationResult] = await operation.promise();

  const annotationResults = operationResult.annotationResults[0];
  return annotationResults;
}

export default analyzeVideoTranscription;
