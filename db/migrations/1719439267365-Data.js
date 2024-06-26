module.exports = class Data1719439267365 {
    name = 'Data1719439267365'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_d02b4de50fca71d0784162b2d9" ON "send_packet_fee_deposited" ("from") `)
        await db.query(`CREATE INDEX "IDX_1cc5eb23056116d478b77b5a39" ON "open_channel_fee_deposited" ("source_address") `)
        await db.query(`CREATE INDEX "IDX_74fba5f2daa03ad5a7758db498" ON "open_channel_fee_deposited" ("from") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_d02b4de50fca71d0784162b2d9"`)
        await db.query(`DROP INDEX "public"."IDX_1cc5eb23056116d478b77b5a39"`)
        await db.query(`DROP INDEX "public"."IDX_74fba5f2daa03ad5a7758db498"`)
    }
}
