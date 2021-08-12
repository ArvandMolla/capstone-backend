"use strict";
import video from "@google-cloud/video-intelligence";

async function analyzeLabelsGCS(gcsUri) {
  // const video = require("@google-cloud/video-intelligence").v1;

  const client = new video.VideoIntelligenceServiceClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const gcsUri = 'gs://strive-proj';

  const request = {
    inputUri: gcsUri,
    features: ["LABEL_DETECTION"],
  };

  // Detects labels in a video
  const [operation] = await client.annotateVideo(request);
  console.log("Waiting for operation to complete...");
  const [operationResult] = await operation.promise();

  // Gets annotations for video
  const annotations = operationResult.annotationResults[0];

  const labels = annotations.segmentLabelAnnotations;
  return labels;
  labels.forEach((label) => {
    console.log(`Label ${label.entity.description} occurs at:`);
    label.segments.forEach((segment) => {
      const time = segment.segment;
      if (time.startTimeOffset.seconds === undefined) {
        time.startTimeOffset.seconds = 0;
      }
      if (time.startTimeOffset.nanos === undefined) {
        time.startTimeOffset.nanos = 0;
      }
      if (time.endTimeOffset.seconds === undefined) {
        time.endTimeOffset.seconds = 0;
      }
      if (time.endTimeOffset.nanos === undefined) {
        time.endTimeOffset.nanos = 0;
      }
      console.log(
        `\tStart: ${time.startTimeOffset.seconds}` +
          `.${(time.startTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
      console.log(
        `\tEnd: ${time.endTimeOffset.seconds}.` +
          `${(time.endTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
      console.log(`\tConfidence: ${segment.confidence}`);
    });
  });
}

export default analyzeLabelsGCS;
