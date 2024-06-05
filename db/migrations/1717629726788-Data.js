module.exports = class Data1717629726788 {
    name = 'Data1717629726788'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_a7c730d5d05ebe97b513ecd712" ON "channel_open_init" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_9f9019b06f61fae1bf0aeeab81" ON "channel_open_try" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_0b57e2a2b16a3083998e367f74" ON "channel_open_ack" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_9dbedd3f76572ed3cb8cb1b0ae" ON "channel_open_confirm" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_725da4108dfceb76b21b080486" ON "close_ibc_channel" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_2b16a868578a45834e1b157c37" ON "send_packet" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_40e14f8c4354fa230a09933b23" ON "recv_packet" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_986dc3125bc59b69a9be6976fc" ON "write_ack_packet" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_8401cf056d9a70581dc63a76c9" ON "acknowledgement" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_7e7fe27ce631df44fa27709981" ON "timeout" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_19de2f87278c52732f41e8ffe4" ON "write_timeout_packet" ("chain_id") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_a7c730d5d05ebe97b513ecd712"`)
        await db.query(`DROP INDEX "public"."IDX_9f9019b06f61fae1bf0aeeab81"`)
        await db.query(`DROP INDEX "public"."IDX_0b57e2a2b16a3083998e367f74"`)
        await db.query(`DROP INDEX "public"."IDX_9dbedd3f76572ed3cb8cb1b0ae"`)
        await db.query(`DROP INDEX "public"."IDX_725da4108dfceb76b21b080486"`)
        await db.query(`DROP INDEX "public"."IDX_2b16a868578a45834e1b157c37"`)
        await db.query(`DROP INDEX "public"."IDX_40e14f8c4354fa230a09933b23"`)
        await db.query(`DROP INDEX "public"."IDX_986dc3125bc59b69a9be6976fc"`)
        await db.query(`DROP INDEX "public"."IDX_8401cf056d9a70581dc63a76c9"`)
        await db.query(`DROP INDEX "public"."IDX_7e7fe27ce631df44fa27709981"`)
        await db.query(`DROP INDEX "public"."IDX_19de2f87278c52732f41e8ffe4"`)
    }
}
