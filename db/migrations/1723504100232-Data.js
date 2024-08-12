module.exports = class Data1723504100232 {
    name = 'Data1723504100232'

    async up(db) {
        await db.query(`ALTER TABLE "channel_open_init" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "channel_open_try" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "channel_open_ack" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "channel_open_confirm" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "close_ibc_channel" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "send_packet" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "recv_packet" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "write_ack_packet" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "acknowledgement" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "timeout" ADD "gas_used" numeric`)
        await db.query(`ALTER TABLE "write_timeout_packet" ADD "gas_used" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "channel_open_init" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "channel_open_try" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "channel_open_ack" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "channel_open_confirm" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "close_ibc_channel" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "recv_packet" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "write_ack_packet" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "acknowledgement" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "timeout" DROP COLUMN "gas_used"`)
        await db.query(`ALTER TABLE "write_timeout_packet" DROP COLUMN "gas_used"`)
    }
}
