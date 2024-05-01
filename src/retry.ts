import logger from "./logger";

export const defaultRetryOpts = {
  retries: 1, // The maximum amount of times to retry the operation.
  factor: 2, // The exponential factor to use.
  minTimeout: 1000, // The number of milliseconds before starting the first retry.
  maxTimeout: 2000, // The maximum number of milliseconds between two retries.
  // Custom retry strategy or additional logging can be specified here
  onRetry: (err: Error, attempt: number) => {
    // This is a good place to log retry attempts if needed
    logger.info(`Retry attempt ${attempt} due to error: ${err.message}`);
  },
};