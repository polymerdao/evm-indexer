export const CATCHUP_BATCH_SIZE = Number(process.env.CATCHUP_BATCH_SIZE ?? "10")
export const ENABLE_CATCHUP = process.env.ENABLE_CATCHUP === 'true'
export const CATCHUP_ERROR_LIMIT = Number(process.env.CATCHUP_ERROR_LIMIT ?? "3")
export const BACKFILL_CONCURRENCY = Number(process.env.BACKFILL_CONCURRENCY ?? "10")