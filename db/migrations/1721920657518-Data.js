module.exports = class Data1721920657518 {
    name = 'Data1721920657518'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_36524a30939bb522f1eda95267" ON "send_packet_fee_deposited" ("send_gas_limit") `)
        await db.query(`CREATE INDEX "IDX_b05770c7b9f6fba9a0b12814e9" ON "send_packet_fee_deposited" ("send_gas_price") `)
        await db.query(`CREATE INDEX "IDX_8847ac7451965338a765734545" ON "send_packet_fee_deposited" ("ack_gas_limit") `)
        await db.query(`CREATE INDEX "IDX_bea86541f9bbed391be346275d" ON "send_packet_fee_deposited" ("ack_gas_price") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_36524a30939bb522f1eda95267"`)
        await db.query(`DROP INDEX "public"."IDX_b05770c7b9f6fba9a0b12814e9"`)
        await db.query(`DROP INDEX "public"."IDX_8847ac7451965338a765734545"`)
        await db.query(`DROP INDEX "public"."IDX_bea86541f9bbed391be346275d"`)
    }
}
