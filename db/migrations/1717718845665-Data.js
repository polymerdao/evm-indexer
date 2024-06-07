module.exports = class Data1717718845665 {
    name = 'Data1717718845665'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_204ca3a3fadf47a486aed88960" ON "packet" ("state") `)
        await db.query(`CREATE INDEX "IDX_d27f20e983024f4ea4f4c6d4ce" ON "packet" ("send_to_recv_time") `)
        await db.query(`CREATE INDEX "IDX_e30ca6d058d6fdec4991c9a3c7" ON "packet" ("send_to_recv_gas") `)
        await db.query(`CREATE INDEX "IDX_9328ebd5dc0fb0cd40b35629c9" ON "packet" ("send_to_ack_time") `)
        await db.query(`CREATE INDEX "IDX_635ec6a53aca56c0b3e462ed13" ON "packet" ("send_to_ack_gas") `)
        await db.query(`CREATE INDEX "IDX_63a635b9ad0d2bde6820be82c7" ON "packet" ("send_to_recv_polymer_gas") `)
        await db.query(`CREATE INDEX "IDX_9225c299ab73da7ae1a781f69e" ON "packet" ("send_to_ack_polymer_gas") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_204ca3a3fadf47a486aed88960"`)
        await db.query(`DROP INDEX "public"."IDX_d27f20e983024f4ea4f4c6d4ce"`)
        await db.query(`DROP INDEX "public"."IDX_e30ca6d058d6fdec4991c9a3c7"`)
        await db.query(`DROP INDEX "public"."IDX_9328ebd5dc0fb0cd40b35629c9"`)
        await db.query(`DROP INDEX "public"."IDX_635ec6a53aca56c0b3e462ed13"`)
        await db.query(`DROP INDEX "public"."IDX_63a635b9ad0d2bde6820be82c7"`)
        await db.query(`DROP INDEX "public"."IDX_9225c299ab73da7ae1a781f69e"`)
    }
}
