"use strict";
import video from "@google-cloud/video-intelligence";

async function analyzeLabelsGCS(gcsUri) {
  const client = new video.VideoIntelligenceServiceClient();

  const request = {
    inputUri: gcsUri,
    features: ["LABEL_DETECTION"],
  };

  const [operation] = await client.annotateVideo(request);
  console.log("Waiting for operation to complete...");
  const [operationResult] = await operation.promise();

  const annotations = operationResult.annotationResults[0];
  const labels = annotations.segmentLabelAnnotations;
  return labels;
}

export default analyzeLabelsGCS;
