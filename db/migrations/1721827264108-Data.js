module.exports = class Data1721827264108 {
    name = 'Data1721827264108'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "gas_limits"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "gas_prices"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "send_gas_limit" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "send_gas_price" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "ack_gas_limit" numeric NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "ack_gas_price" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "gas_limits" integer array NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD "gas_prices" integer array NOT NULL`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "send_gas_limit"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "send_gas_price"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "ack_gas_limit"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP COLUMN "ack_gas_price"`)
    }
}
