module.exports = class Data1717718236078 {
    name = 'Data1717718236078'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_5433148c7aff660fb13ab7ed55" ON "channel_catch_up_error" ("init_to_try_polymer_gas") `)
        await db.query(`CREATE INDEX "IDX_70dfe05652a1b8d3d4ff134b93" ON "channel_catch_up_error" ("init_to_confirm_polymer_gas") `)
        await db.query(`CREATE INDEX "IDX_76ea5e0d05bf86983646d36fef" ON "channel_catch_up_error" ("init_to_ack_polymer_gas") `)
        await db.query(`CREATE INDEX "IDX_7f291c14d126ce5af5e9777fde" ON "packet_catch_up_error" ("send_to_recv_polymer_gas") `)
        await db.query(`CREATE INDEX "IDX_e8287203a0d456d2421768e448" ON "packet_catch_up_error" ("send_to_ack_polymer_gas") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_5433148c7aff660fb13ab7ed55"`)
        await db.query(`DROP INDEX "public"."IDX_70dfe05652a1b8d3d4ff134b93"`)
        await db.query(`DROP INDEX "public"."IDX_76ea5e0d05bf86983646d36fef"`)
        await db.query(`DROP INDEX "public"."IDX_7f291c14d126ce5af5e9777fde"`)
        await db.query(`DROP INDEX "public"."IDX_e8287203a0d456d2421768e448"`)
    }
}
